module.exports = {
    
    // finds a room by roomname
    // @param rooms : list of all rooms
    // @param roomname : rooname to search for
    // @returns a Room()
    getRoomByName: async (Room, roomname) => {
        return await new Promise((resolve, reject) => Room.find({ name: roomname }, (err, docs) => { resolve(docs) }))
    },

    // returns the room a member is in
    // @param rooms : list of all rooms
    // @param id : member id
    // @returns Room()
    getRoomByUserID: async (Room, id) => {
        return await new Promise((resolve, reject) => Room.find({ 'members.id': id }, (err, docs) => { resolve(docs) }))
    },

    // returns the index of the member object in a room
    // @param room: the Room object
    // @param id : member id
    // @returns index number
    getMemberObjIndexFromRoom: (room, id) => {
        for (let i = 0; i < room.members.length; i++) {
            if (room.members[i].id == id) return i
        }

        return null
    },

    // generates a random roomname
    // @param getRoomByName: utility,getRoomByName; gets a room by the room's name
    // @param rooms: list of all rooms
    // @param word: chance.word; returns a random word between a min and max length 
    // @returns string; roomname
    generateRoomname: chance => {
        const min = 3, max = 12 // max and min length of roomname

        return chance.word({ length: Math.floor(Math.random() * (max - min + 1) + min) })
    },

    // saves a model to db
    // @param model: model to save
    save: async model => {
        return await new Promise((resolve, reject) => model.save((err, model) => resolve()))
    }

}