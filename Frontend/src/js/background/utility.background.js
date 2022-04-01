// checks if user is in a netflix video
const isUserInVideo = async () => {
    let promise = new Promise((resolve, reject) => {
        chrome.tabs.query({ currentWindow: true, active: true }, tab => {
            if (tab[0].url.includes(networkVideo[getCurrentNetwork()])) resolve(true)
            else resolve(false)
        })
    })

    return await promise
}

// gets the current networks name
// @param url : the url to check
const getCurrentNetwork = (url = null) => {
    if (url !== null) {
        let host = new URL(url).hostname
        let name = host.substring(
            host.indexOf(".") + 1,
            host.lastIndexOf(".")
        )

        return name
    } else if (url === null) {
        chrome.tabs.query({ currentWindow: true, active: true }, tab => {
            let host = new URL(tab[0].url).hostname
            let name = host.substring(
                host.indexOf(".") + 1,
                host.lastIndexOf(".")
            )

            return name
        })
    }
}

// gets the video id from a url
// @param url string: url
const getVideoID = url => {
    let videoID
    if (url.includes('?')) {
        videoID = url.substring(
            url.lastIndexOf("/") + 1,
            url.lastIndexOf("?")
        )
    } else {
        var n = url.lastIndexOf('/');
        videoID = url.substring(n + 1);
    }

    return videoID
}

// sends a message to sidebar
// @param message str : message to send
// @param data any : data to send, if any
const messageSidebar = async (message, data = null) => {
    let promise = new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            from: 'background',
            to: 'sidebar',
            message: message,
            data: data
        }, res => resolve(res))
    })

    return await promise
}
