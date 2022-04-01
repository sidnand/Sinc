// updates everyones videos
// play / pause --> 'play' / 'pause'
// seek --> { seek: time }
const send = async message => {
    connection.send(message)
}

// when user recieves a message
connection.onmessage = e => {
    if (e.data === 'play') messageContentScript('sidebar', 'play')
    if (e.data === 'pause') messageContentScript('sidebar', 'pause')
    if (e.data.seek !== undefined) messageContentScript('sidebar', 'seek', e.data.seek)

    if (e.data.memberMic !== undefined) toggleMemberMic(e.data.memberMic)
}