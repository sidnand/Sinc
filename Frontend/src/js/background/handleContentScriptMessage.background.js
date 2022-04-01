let handleContentScriptMessage = (request, sender, respond) => {

    // sets the tab id
    if (request.message === 'set tab id') user.tabID = sender.tab.id
    // increament user watching int on server
    if (request.message === 'toggle user watching') {
        if (user.roomname !== null) {
            socket.emit('toggle user watching', user.roomname, request.data)
            // if user is in a video and in a room
            // start the sync
            if (request.data) messageContentScript('background', 'initalize sync', true)
        }
        // if user is not in a room, play video like normal
        else if (user.roomname === null) messageContentScript('background', 'initalize sync', false)
    }
    // when this user's video is loaded
    if (request.message === 'user is setup') {
        if (user.roomname !== null) {
            socket.emit('update setup count', user.roomname, resyncUser)
            resyncUser = false
        }
    }

    if (request.message === 'video data') {
        if (syncUser != null) socket.emit('resync user', { videoData: request.data, syncUser: syncUser, roomname: user.roomname })
        syncUser = null
    }

    if (user.roomname !== null) {
        if (request.message === 'play') socket.emit('play', user.roomname)
        if (request.message === 'pause') socket.emit('pause', user.roomname)
        if (request.message === 'seek') socket.emit('seek', user.roomname, request.data)
    }

}