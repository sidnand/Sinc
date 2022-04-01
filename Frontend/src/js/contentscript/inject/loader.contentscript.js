// shows the loader
const showLoader = () => {
    let loader

    // check if loader is already injected
    if (document.getElementById('view-loading') !== null) document.getElementById('view-loading').style.display = 'block'
    else if (document.getElementById('view-loading') === null) {
        loader = document.createElement('div')
        loader.id = 'view-loading'
        loader.innerHTML = `
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    `

        document.body.appendChild(loader)
    }
}

// hides the loader
const removeLoader = () => document.getElementById('view-loading').style.display = 'none'