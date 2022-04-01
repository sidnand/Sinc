module.exports = {

    // creates a new room
    // @param socket: socketio object
    // @param Room: new Room() constructor
    // @param data: data passed through socket to create new room
    // returns a new Room()
    createRoom: async ({ socket, Room, data }) => {

        // create a new room
        let newRoom = new Room({
            name: data.roomname
        })

        await module.exports.joinRoom(socket, data.roomname)

        // add client to room object
        newRoom.members.push({ name: data.name, id: socket.id, mic: false })
        return newRoom

    },

    // checks if the user can join the room
    // @param rooms: list of all rooms
    canJoin: room => {

        // if there is no room created
        if (room.length <= 0) return { bool: false, msg: 'Room does not exit, please create it' }

        return { bool: true }

    },

    // async function that waits till user has joined room
    // @param socket: socket function
    // @param roomname: name of room
    // returns a new promise
    joinRoom: async (socket, roomname) => {
        return await new Promise((resolve, reject) => socket.join(roomname, () => resolve(true)))
    },

    // removes room if empty (cleans up room)
    // @param rooms: list of all rooms
    // @param r: room object
    // returns a new rooms object
    cleanRoom: async (Room, r) => {
        // if room is empty
        if (r.members.length <= 0) return await new Promise((resolve, reject) => Room.findByIdAndDelete(r._id, err => { resolve() }))
    },

    // removes user from room object
    // @param room: the room object
    // @param index: index of user in members array
    // retuens a new room object
    removeUser: (room, index) => {
        if (room !== undefined) {
            if (index > -1) {
                room.members.splice(index, 1) // remove client from room object

                return room
            }
        }
    }

}