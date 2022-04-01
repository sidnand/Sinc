module.exports = Schema => {
    return new Schema({
        name: String,
        members: [{ name: String, id: String, mic: Boolean }],
        videoID: { type: String, default: '' },
        setupCount: { type: Number, default: 0 },
        usersWatching: [String]
    })
}