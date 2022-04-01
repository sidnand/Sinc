// loads the settings
const loadSettings = async () => {
    let s = await new Promise((resolve, reject) => chrome.storage.sync.get(['settings'], result => resolve(result.settings)))

    if (s != undefined) settings = { ...settings, ...s }

    // volume
    let volumeFrom0To100 = settings.volume * 100
    DOM.input.volume.value = volumeFrom0To100
    updateVolume(volumeFrom0To100, false)

    // sidebar in fullscreen
    DOM.input.sidebarFullscreen.checked = settings.showSidebarInFullscreen
    updateSidebarFullscreen(settings.showSidebarInFullscreen, false)
}

// updates the volume
// @param v : volume from 0 to 100
const updateVolume = async (v, save = true) => {
    let vol = v / 100
    let tags = document.getElementsByTagName('audio')
    for (let i = 0; i < tags.length; i++) tags[i].volume = vol

    updateVolumeText()

    if (save) await updateSetting({ volume: vol })
}

// if user wants to see the sidebar while in fullscreen
const updateSidebarFullscreen = async (b, save = true) => {
    if (save) await updateSetting({ showSidebarInFullscreen: b })

    // send message to contentscript
    messageContentScript('sidebar', 'show sidebar in fullscreen', b)
}

// changes the emoji on the volume text
const updateVolumeText = () => {
    if (DOM.input.volume.value < 1) DOM.text.callVolume.innerHTML = `Call Volume ${String.fromCodePoint(emojies.speaker.mute)}`
    if (DOM.input.volume.value <= 50 && DOM.input.volume.value >= 1) DOM.text.callVolume.innerHTML = `Call Volume ${String.fromCodePoint(emojies.speaker.mid)}`
    if (DOM.input.volume.value > 50) DOM.text.callVolume.innerHTML = `Call Volume ${String.fromCodePoint(emojies.speaker.load)}`
}

// updates the settings
const updateSetting = async n => {
    settings = { ...settings, ...n }

    await new Promise((resolve, reject) => chrome.storage.sync.set({ "settings": settings }, result => resolve()))
}