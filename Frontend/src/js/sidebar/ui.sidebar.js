// hides all views
const hideAllViews = () => {
    for (let i = 0; i < DOM.allViews.length; i++) {
        DOM.allViews[i].style.display = 'none'
    }
}

// loads a view
// @param type : type of view
// @data : data that needs to be passed to the view; if any
const loadView = async (type, data) => {
    hideAllViews() // hide all view first

    switch (type) {

        case 'loading':
            DOM.view.loading.style.display = 'block'
            break;

        case 'error':
            DOM.view.error.style.display = 'block'
            break;

        case 'room logon':
            DOM.view.roomLogon.style.display = 'block'
            break;

        case 'hangout area':
            DOM.text.roomname.innerHTML = `<h2>${data.user.roomname}</h2>`

            if (data.members.length <= 0) DOM.dashboard.innerHTML = `<h2>Others in this room will show up here...</h2>`
            else if (data.members.length > 0)  {
                DOM.dashboard.innerHTML = ''
                let members = []
                for (let i = 0; i < data.members.length; i++) {
                    members.push({ name: data.members[i].name, id: data.members[i].id, mic: data.members[i].mic })

                    if (data.members[i].mic) {
                        DOM.dashboard.innerHTML += `
                            <div class="member" data-id='${data.members[i].id}'>
                                <h3>${data.members[i].name} <i style="color: blue" class="fas fa-microphone member-mic"></i></h3>
                            </div>
                        `
                    } else if (!data.members[i].mic) {
                        DOM.dashboard.innerHTML += `
                            <div class="member" data-id='${data.members[i].id}'>
                                <h3>${data.members[i].name} <i style="color: #333333" class="fas fa-microphone member-mic"></i></h3>
                            </div>
                        `
                    }
                }

                await messageBackground('update user', { members: members})

            }

            DOM.view.hangoutArea.style.display = 'block'
            
            break;

    }
}

// adds a new member
const addNewMember = async (name, id) => {
    let user = await messageBackground('get user')
    let members = user.members

    if (members.length <= 0) {
        DOM.dashboard.innerHTML = `
            <div class="member" data-id='${id}'>
                <h3>${name} <i class="fas fa-microphone member-mic"></i></h3>
            </div>
        `
    }
    else if(members.length > 0) {
        DOM.dashboard.innerHTML += `
            <div class="member" data-id='${id}'>
                <h3>${name} <i class="fas fa-microphone member-mic"></i></h3>
            </div>
        `
    }

    members.push({ name: name, id: id, mic: false })

    await messageBackground('update user', { members: members })
}

// removes a member
const removeMember = async id => {

    // remove from list
    let user = await messageBackground('get user')
    let members = user.members

    for (let i = 0; i < members.length; i++) {
        if (members[i].id == id) members.splice(i, 1)
    }

    if (members.length <= 0) {
        members = []
        DOM.dashboard.innerHTML = `<h2>Others in this room will show up here...</h2>`
    }

    await messageBackground('update user', { members: members })

    // remove from ui
    let membersUI = document.querySelectorAll('.member')

    for (let i = 0; i < membersUI.length; i++) {
        if (membersUI[i].getAttribute('data-id') == id) membersUI[i].remove()
    }

}

const toggleMemberMic = async data => {
    let user = await messageBackground('get user')
    let members = user.members

    // update user
    for (let i = 0; i < members.length; i++) {
        if (members[i].id == data.id) members[i].mic = data.mic
    }

    await messageBackground('update user', { members: members })

    // update ui
    let membersUI = document.querySelectorAll('.member')

    for (let i = 0; i < membersUI.length; i++) {
        if (membersUI[i].getAttribute('data-id') == data.id) {
            if (data.mic) membersUI[i].getElementsByClassName('member-mic')[0].style.color = micToggleCol.on
            if (!data.mic) membersUI[i].getElementsByClassName('member-mic')[0].style.color = micToggleCol.off
        }
    }
}

// shows mic as on or off
const showMicOn = () => DOM.button.mic.style.color = micToggleCol.on
const showMicOff = () => DOM.button.mic.style.color = micToggleCol.off

// toggles the settings menu
const toggleSettings = () => {
    if (window.getComputedStyle(DOM.settingsMenu, null).getPropertyValue("pointer-events") === 'none') {
        DOM.settingsMenu.style.pointerEvents = 'all'
        DOM.settingsMenu.style.opacity = 1
        DOM.button.settings.style.transform = 'rotateZ(90deg)'
    } else if (window.getComputedStyle(DOM.settingsMenu, null).getPropertyValue("pointer-events") === 'all') {
        DOM.settingsMenu.style.pointerEvents = 'none'
        DOM.settingsMenu.style.opacity = 0
        DOM.button.settings.style.transform = 'rotateZ(0deg)'
    }
}