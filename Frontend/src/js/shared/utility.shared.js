// sends a message to content script
// @param message str : message to send
// @param data any : data to send, if any
// @param data { type: 'notification', message: '' } --> in order to send a notification message
const messageContentScript = (from, message, data = null) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { from: from, to: 'contentscript', message: message, data: data })
    })
}