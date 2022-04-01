const sidebarCords = { show: '400px', hide: '0px' } // show and hide sidebar data

let sidebar = document.getElementById('sidebar') // get sidebar

// show the sidebar
let show = () => sidebar.style.marginRight = sidebarCords.show

// hide the sidebar
function hide(e) {
    let x = sidebar.getBoundingClientRect().x
    let w = sidebar.getBoundingClientRect().width
    let rightSide = x + w

    // if mouse is not inbetween the sidebar and right side of screen gap, then close the sidebar
    if (e.clientX < rightSide) sidebar.style.marginRight = sidebarCords.hide
}

sidebar.addEventListener('mouseover', show)
sidebar.addEventListener('mouseout', function (e) { hide(e) })