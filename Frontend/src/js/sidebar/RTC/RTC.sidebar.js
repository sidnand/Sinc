// setup RTC connection
let connection = new RTCMultiConnection()
connection.socketURL = url

connection.session = {
    audio: false,
    video: false,
    data: true
}

connection.iceServers = [{
    'urls': [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun.l.google.com:19302?transport=udp',
    ]
}]

// connects user to server for RTC
// @param roomname : name of room to connect to
const connectRTC = async roomname => {

    connection.checkPresence(roomname, (isRoomExist, roomid) => {
        if (isRoomExist) {
            connection.join(roomid)
        } else {
            connection.open(roomid)
        }
    })

}

// disconnects from RTC
const disconnectRTC = async () => {

    // disconnect with all users
    connection.getAllParticipants().forEach(function (pid) {
        connection.disconnectWith(pid)
    })

    connection.closeSocket()

}