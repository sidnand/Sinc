connection.mediaConstraints = {
    audio: {
        mandatory: {
            echoCancellation: false, // disabling audio processing
            googAutoGainControl: true,
            googNoiseSuppression: true,
            googHighpassFilter: true,
            googTypingNoiseDetection: true,
            //googAudioMirroring: true
        },
    },
    video: false
}

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: false
}

// when stream has started
connection.onstream = async e => {
    if (e.userid !== connection.userid) {
        let tag = e.mediaElement
        tag.controls = false
        tag.volume = settings.volume
        document.body.appendChild(tag)
    }
}

connection.onstreamended = async e => {
    if (e.userid !== connection.userid) {
        let tag = document.getElementById(e.mediaElement.id)
        if (tag) tag.parentElement.removeChild(tag)
    }
}

// enter a call
const enterCall = async () => {
    let promise = new Promise((resolve, reject) => {
        connection.addStream({
            audio: true,
            streamCallback: async stream => resolve(stream)
        })
    })

    return await promise
}

// exit the call
const exitCall = async () => {
    let tags = document.getElementsByTagName('audio')
    for (let i = 0; i < tags.length; i++) tags[i].parentElement.removeChild(tags[i])

    connection.streamEvents.selectAll({
        local: true
    }).forEach(function (streamEvent) {
        streamEvent.stream.getAudioTracks()[0].stop()
    })
}