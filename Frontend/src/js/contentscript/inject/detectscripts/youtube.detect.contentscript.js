const youtubeVideoURL = 'youtube.com/watch?v='

let fromServer = false
let player

const main = () => {
    window.postMessage({ from: 'detectscript', to: 'background', message: 'set tab id' })
    window.addEventListener('yt-page-data-updated', checkURL)

    // check url when injected
    checkURL()
}

const checkURL = async () => {
    // if on video
    if (window.location.href.includes(youtubeVideoURL)) {
        player = document.querySelector('#movie_player video')
        player.pause()
        player.currentTime = 0

        document.querySelector('#content').style.opacity = 0
        showLoader()

        window.postMessage({ from: 'detectscript', to: 'background', message: 'toggle user watching', data: true })
    }

    // exit sync
    else if (!window.location.href.includes(youtubeVideoURL)) window.postMessage({ from: 'detectscript', to: 'background', message: 'toggle user watching', data: false })

}

let initalizeSync = isInRoom => {
    if (isInRoom) {
        window.postMessage({ from: 'detectscript', to: 'contentscript', message: 'notification', data: 'Waiting for video' })
        console.log('Waiting for video tag')

        setTimeout(() => window.postMessage({ from: 'detectscript', to: 'background', message: 'user is setup' }), 4000)
    }
}

let startSync = () => {
    window.postMessage({ from: 'detectscript', to: 'contentscript', message: 'notification', data: 'Everyone is setup, starting video' })
    console.log('All users have joined. starting video')

    removeLoader()
    document.querySelector('#content').style.opacity = 1
}

const play = () => {
}

const pause = () => {
}

const seek = time => {  }

// updates the current video
// @param id : video id
const updateVideo = id => window.location.href = `https://youtube.com/watch?v=${id}`

main()