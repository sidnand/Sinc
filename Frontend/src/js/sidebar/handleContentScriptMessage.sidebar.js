let handleContentScriptMessage = async (request, sender, respond) => {

    // if user disconnected from the server side
    if (request.message === 'play') { await send('play'); respond(null) }
    if (request.message === 'pause') { await send('pause'); respond(null) }
    if (request.message === 'seek') { await send({ seek: request.data }); respond(null) }


}