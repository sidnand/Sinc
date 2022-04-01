// runs when chrome tab is updated
const handleTabUpdate = async (tabId, changeInfo, tab) => {
    if (user.roomname !== null) {

        if (tab.status !== undefined) {
            if (tab.status === 'complete') {

                if (tab.url.includes(networkVideo[getCurrentNetwork(tab.url)])) {

                    if (!resyncUser) {
                        // send request to change video on room
                        let videoID = getVideoID(tab.url)

                        // update video on server end
                        socket.emit('update video', user.roomname, videoID)
                    }

                }

            }
        }

    }
}

// runs when chrome tab is removed
const handleTabRemove = (tabId, changeInfo, tab) => {
    if (tabId === user.tabID) {
        if (user.roomname !== null) {
            socket.emit('leave room', user.roomname)
            user = { // data about the user
                roomname: null,
                name: null,
                id: null,
                members: [],
                mic: false,
                tabID: null
            }
        }
    }
}
