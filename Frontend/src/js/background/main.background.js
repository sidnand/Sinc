const main = () => {

    // listen to messages from extension
    chrome.runtime.onMessage.addListener((request, sender, respond) => {
        if (request.to === 'background') {
            if (request.from === 'sidebar') { handleSidebarMessage(request, sender, respond); return true }
            if (request.from === 'contentscript') { handleContentScriptMessage(request, sender, respond); return true }
        }
    })

    // listen to messages from server
    socket.on('update video', videoID => handleServerMessage('update video', videoID))
    socket.on('start sync', () => handleServerMessage('start sync'))

    // notifications from the server
    socket.on('notification', notification => handleServerMessage('notification', notification))

    socket.on('new member', memberData => handleServerMessage('new member', memberData))
    socket.on('remove member', id => handleServerMessage('remove member', id))

    socket.on('get video data', user => handleServerMessage('get video data', user))
    socket.on('resync user', data => handleServerMessage('resync user', data))

    // on disconnect
    socket.on('disconnect', disconnection)

    // chrome browser listeners
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => handleTabUpdate(tabId, changeInfo, tab))
    chrome.tabs.onRemoved.addListener((tabId, changeInfo, tab) => handleTabRemove(tabId, changeInfo, tab))

}

// handles disconnections
const disconnection = () => {

    if (user.roomname !== null) {

        user = { // data about the user
            roomname: null,
            name: null,
            mic: false,
            tabID: null,
            members: [],
            id: null
        }

        chrome.runtime.sendMessage({
            from: 'background',
            to: 'sidebar',
            message: 'disconnected'
        }, res => { })

        messageContentScript('background', 'message', { type: 'error', message: "Disconnected" })

    }

}

window.onload = main