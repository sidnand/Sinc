// sends a message to background
// @param message str : message to send
// @param data any : data to send, if any
const messageBackground = async (message, data = null) => {
    let promise = new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            from: 'sidebar',
            to: 'background',
            message: message,
            data: data
        }, res => resolve(res))
    })

    return await promise
}
