// libraries
const RTCMultiConnectionServer = require('rtcmulticonnection-server') // for RTC communication
const chance = require('chance').Chance()
const mongoose = require('mongoose')

// mongoose schemas
const roomSchema = require('./models/Room')

// modules
const config = require('./config')
const utility = require('./utility')
const roomManagement = require('./roomManagement')

let Room = mongoose.model('Room', roomSchema(mongoose.Schema), 'rooms') // room object for database

mongoose.connect(config.mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true })

const PORT = process.env.PORT || 3000 // localhost port

const server = require('http').createServer(),
    io = require('socket.io')(server, {
        path: '/',
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false,
        origins: '*:*'
    })

// main function
let main = () => io.on('connection', connections) // check if connected, call function

// handles all connections
let connections = socket => {

    // for webRTC communication
    RTCMultiConnectionServer.addSocket(socket)

    socket.on('resync user', data => {
        socket.to(data.roomname).emit('notification', `${data.syncUser.name} joined`)
        io.to(data.syncUser.id).emit('resync user', data.videoData)
    })

    // handle notificationss
    socket.on('notification', data => socket.to(data.roomname).emit('notification', data.notification))

    // create, join and leave
    socket.on('create room', async (data, respond) => {

        let room = await utility.getRoomByName(Room, data.roomname) // get the room

        // if room is not an empty array, that means the room already exists
        if (room.length > 0) { respond({ type: 'error', message: 'Room already exists' }); return }

        // else create a new room
        let newRoom = await roomManagement.createRoom({ socket: socket, data: data, Room: Room }) // get a new room
        await utility.save(newRoom) // save to database

        respond({ type: 'success', message: `Successfully created room: ${data.roomname}`, data: { roomname: newRoom.name, members: [], id: socket.id } })

    })

    socket.on('join room', async (data, respond) => {

        let room = await utility.getRoomByName(Room, data.roomname) // get the room

        // if room is an empty array, that means the room does not exist=
        let canJoin = roomManagement.canJoin(room)

        // if can't join room
        if (!canJoin.bool) { respond({ type: 'error', message: canJoin.msg }); return }

        // wait till user has joined the room
        await roomManagement.joinRoom(socket, room[0].name)
        let membersData = room[0].members.slice() // save
        room[0].members.push({ name: data.name, id: socket.id, mic: false })

        await utility.save(room[0]) // save to database

        // if room is already in a video
        if (room[0].videoID.length > 0) {
            // get current video url and time from another user
            socket.to(data.roomname).emit('new member', { name: data.name, id: socket.id })
            respond({ type: 'success', message: `Successfully joined room: ${data.roomname}`, data: { roomname: room[0].name, id: socket.id, members: membersData, videoID: room[0].videoID } })
        } else {
            socket.to(data.roomname).emit('notification', `${data.name} joined`)
            socket.to(data.roomname).emit('new member', { name: data.name, id: socket.id })
            respond({ type: 'success', message: `Successfully joined room: ${data.roomname}`, data: { roomname: room[0].name, id: socket.id, members: membersData } })
        }

    })

    socket.on('leave room', async () => { let id = socket.id; await leaveRoom(id, socket) })

    // update video
    socket.on('update video', async (roomname, videoID) => {
        let room = await utility.getRoomByName(Room, roomname) // get the room

        if (room.length > 0 && room[0].videoID !== videoID) {
            room[0].videoID = videoID
            await utility.save(room[0])

            socket.to(roomname).emit('update video', videoID)
        }
    })

    // setting up users
    socket.on('update setup count', async (roomname, resync) => {
        let room = await utility.getRoomByName(Room, roomname) // get the room

        if (room.length > 0) {
            if (resync) {
                // user is resyncing
                let i = utility.getMemberObjIndexFromRoom(room[0], socket.id)

                io.to(room[0].members[0].id).emit('get video data', {id: socket.id, name: room[0].members[i].name})
            } else {
                room[0].setupCount++

                // if all members are setup, start the video
                if (room[0].setupCount >= room[0].members.length) {
                    room[0].setupCount = 0
                    io.in(roomname).emit('start sync')
                }

                await utility.save(room[0])
            }

        }
    })

    // increment users watching int
    socket.on('toggle user watching', async (roomname, isWatching) => await toggleUsersWatching(socket.id, roomname, isWatching))

    // generates a random roomname
    socket.on('generate roomname', respond => respond(utility.generateRoomname(chance)))

    // on disconnect
    socket.on('disconnect', async () => { let id = socket.id; await leaveRoom(id, socket) })

    socket.on('toggle mic', async data => {

        let room = await utility.getRoomByUserID(Room, socket.id)
        if (room.length <= 0) return
        let userIndex = utility.getMemberObjIndexFromRoom(room[0], socket.id)

        room[0].members[userIndex].mic = data
        await utility.save(room[0]) // save to database

    })

}

// remove user from room
// @param socket: socket object
// @param room: room object
const leaveRoom = async (id, socket) => {
    let room = await utility.getRoomByUserID(Room, id)

    if (room.length <= 0) return // if room is empty, return out of the function
    let userIndex = utility.getMemberObjIndexFromRoom(room[0], id)

    // make user leave room
    await new Promise((resolve, reject) => socket.leave(room[0].name, () => {
        socket.to(room[0].name).emit('remove member', socket.id)
        socket.to(room[0].name).emit('notification', `${room[0].members[userIndex].name} left`)
        resolve()
    }))

    // remove user from watching count
    room = await toggleUsersWatching(id, room[0].name, false, true)

    // clean member from room object
    room = roomManagement.removeUser(room, userIndex)
    await utility.save(room) // save to database

    // clean room
    await roomManagement.cleanRoom(Room, room)
}

// @param ret : if function should return
const toggleUsersWatching = async (id, roomname, isWatching, ret = false) => {
    let room = await utility.getRoomByName(Room, roomname) // get the room

    if (room.length > 0) {

        if (isWatching) room[0].usersWatching.push(id)
        else if (!isWatching) {
            // remove user
            let index = room[0].usersWatching.indexOf(id)
            if (index > -1) room[0].usersWatching.splice(index, 1)

            if (room[0].usersWatching.length <= 0) room[0].videoID = ''
        }

        if (ret) return room[0]
        else if (!ret) await utility.save(room[0])

    }
}

// listen at port and call main function
server.listen(PORT, main)