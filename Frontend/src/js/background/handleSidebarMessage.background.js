let handleSidebarMessage = (request, sender, respond) => {

    // when sidbar wants the user object
    if (request.message === 'get user') respond(user)
    // sends a notification to all other users
    if (request.message === 'notification') { socket.emit('notification', { roomname: user.roomname, notification: request.data }); respond(true) }

    if (request.message === 'toggle mic') { socket.emit('toggle mic', request.data); respond(true) }

    // updates a key value pair in user object
    if (request.message === 'update user') {
        let data = request.data

        user = { ...user, ...data }
        respond(user)
    }

    if (request.message === 'create room' || request.message === 'join room') { processCreateOrJoinRoom(request.message, request.data, respond); return true }

    if (request.message === 'leave room') { processLeaveRoom(respond); return true }

    if (request.message === 'generate roomname') { socket.emit('generate roomname', response => respond(response)); return true }

    if (request.message === 'set resync') {
        resyncUser = request.data
        respond(resyncUser)
    }

}

const processCreateOrJoinRoom = async (message, data, respond) => {

    let isInVideo = await isUserInVideo() // check if user is in video

    // check if user is in a video
    if (isInVideo) {
        if (message === 'create room') respond({ type: 'error', message: `Please exit video before creating a room` })
        if (message === 'join room') respond({ type: 'error', message: `Please exit video before joining a room` })
    } else if (!isInVideo) {
        if (message === 'create room') socket.emit('create room', data, response => respond(response))
        if (message === 'join room') socket.emit('join room', data, response => respond(response))
    }

    return true

}

const processLeaveRoom = async respond => {
    if (user.roomname !== null) {
        socket.emit('leave room', user.roomname)
        respond({ type: 'neutral', message: `Successfully left ${user.roomname}` })

        user = { // data about the user
            roomname: null,
            name: null,
            id: null,
            members: [],
            mic: false,
            tabID: null
        }
    }

    respond(null)
}