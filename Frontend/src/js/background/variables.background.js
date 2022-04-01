const socket = io(url)
const supportedNetworks = [ 'netflix' ] // list of all supported networks
const networkVideo = { // stores objects with the route or url that has the networks video
    netflix: '/watch/'
}

let user = { // data about the user
    roomname: null,
    name: null,
    id: null,
    mic: false,
    tabID: null,
    members: []
}

resyncUser = false
syncUser = null