let handleBackgroundMessage = async (request, sender, respond) => {

    // if user disconnected from the server side
    if (request.message === 'disconnected') {
        let user = await messageBackground('get user')
        await exitCall(user)
        showMicOff()
        loadView('error')
        respond(null)
    }

    if (request.message === 'new member') addNewMember(request.data.name, request.data.id)
    if (request.message === 'remove member') removeMember(request.data)

}