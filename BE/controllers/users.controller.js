const { fetchUsers, fetchUsersbyId, fetchUsersPlaylists,
    createUsers, createPlaylist, addSongs,
    patchUsername, patchPlaylistName, patchUserEmail, patchUserPassword,
    terminatePlaylist, terminateUsers, terminatePlaylistSongs } = require("../models/users.model")

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({ users })
    })
        .catch((err) => {
            next(err)
        })
}

exports.getUsersById = (req, res, next) => {
    const { username } = req.params
    fetchUsersbyId(username)
        .then((user) => {
            res.status(200).send({ user })
        })
        .catch((err) => {
            next(err)
        })
}

exports.getUsersPlaylists = (req, res, next) => {
    const { username } = req.params
    fetchUsersPlaylists(username).then((playlists) => {
        res.status(200).send({ playlists })
    })
        .catch((err) => {
            next(err)
        })
}
const bcrypt = require("bcrypt")

exports.postUsers = async (req, res, next) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).send({ msg: "missing required fields" })
    }
    if (username.length < 3 || username.length > 20) {
        return Promise.reject({ status: 400, msg: "username must be between 3 and 20 characters" })
    }
    if (password.length < 6) {
        return Promise.reject({ status: 400, msg: "password must be at least 6 characters long" })
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return Promise.reject({ status: 400, msg: "missing required fields" })
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return Promise.reject({ status: 400, msg: "invalid email format" })
    }
    if (typeof username && typeof email && typeof password !== "string") {
        return Promise.reject({ status: 400, msg: "invalid input types" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    createUsers(username, email, hashedPassword).then((user) => {
        delete user.password
        res.status(201).send({ user })
    })
        .catch((err) => {
            next(err)
        })
}

exports.postPlaylists = (req, res, next) => {
    const { username } = req.params
    const { name } = req.body
    if (name && typeof name !== "string") {
        return res.status(400).send({ msg: "invalid input types" })
    }
    if (!name || name.trim() === '') {
        return res.status(400).send({ msg: "missing required fields" })
    }
    createPlaylist(username, name).then((playlist) => {
        res.status(201).send({ playlist })
    })
        .catch((err) => {
            next(err)
        })
}
exports.postPlaylistSongs = (req, res, next) => {
    const { username, playlist_id } = req.params
    const { song_id } = req.body
    if (!song_id) {
        return res.status(400).send({ msg: "missing required fields" })
    }
    addSongs(username, playlist_id, song_id).then((playlist) => {
        res.status(201).send({ playlist })
    })
        .catch((err) => {
            next(err)
        })
}
exports.updateUsername = (req, res, next) => {
    const { username } = req.params
    const { new_username } = req.body
    if (!new_username) {
        return res.status(400).send({ msg: "bad request" })
    }
    if (new_username.length < 3 || new_username.length > 20) {
        return Promise.reject({ status: 400, msg: "username must be between 3 and 20 characters" })
    }
    if (typeof new_username !== "string") {
        return Promise.reject({ status: 400, msg: "invalid input types" })
    }
    if (new_username.trim() === '') {
        return res.status(400).send({ msg: "bad request" })
    }
    patchUsername(username, new_username).then((updated_user) => {
        res.status(200).send({ updated_user })
    })
        .catch((err) => {
            next(err)
        })
}
exports.updatePLaylistName = (req, res, next) => {
    const { username, playlist_id } = req.params
    const { new_playlist_name } = req.body
    if (!new_playlist_name) {
        return res.status(400).send({ msg: "bad request" })
    }
    if (typeof new_playlist_name !== "string") {
        return res.status(400).send({ msg: "bad request" })
    }
    if (new_playlist_name.trim() === '') {
        return res.status(400).send({ msg: "bad request" })
    }
    patchPlaylistName(username, playlist_id, new_playlist_name).then((updated_playlist) => {
        res.status(200).send({ updated_playlist })
    })
        .catch((err) => {
            next(err)
        })
}
exports.updateUserEmail = (req, res, next) => {
    const { username } = req.params
    const { email } = req.body
    if (!email) {
        return res.status(400).send({ msg: "bad request" })
    }
    if (typeof email !== "string") {
        return res.status(400).send({ msg: "bad request" })
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).send({ msg: "bad request" })
    }
    patchUserEmail(username, email).then((updated_user) => {
        res.status(200).send({ updated_user })
    })
        .catch((err) => {
            next(err)
        })
}
exports.updateUserPassword = (req, res, next) => {
    const { username } = req.params
    const { old_password, new_password } = req.body
    if (!old_password || !new_password) {
        return res.status(400).send({ msg: "bad request" })
    }
    if (typeof old_password !== "string" || typeof new_password !== "string") {
        return res.status(400).send({ msg: "bad request" })
    }
    if (old_password.trim() === '' || new_password.trim() === '') {
        return res.status(400).send({ msg: "bad request" })
    }
    if (new_password.length < 6) {
        return res.status(400).send({ msg: "password must be at least 6 characters long" })
    }
    bcrypt.hash(new_password, 10).then((hashedPassword) => {
        patchUserPassword(username, old_password, hashedPassword).then((updated_user) => {
            delete updated_user.password
            res.status(200).send({ updated_user })
        })
            .catch((err) => {
                next(err)
            })
    })
}
exports.deletePlaylist = (req, res, next) => {
    const { username, playlist_id } = req.params
    terminatePlaylist(username, playlist_id).then((deleted_playlist) => {
        res.status(204).send({})
    })
        .catch((err) => {
            next(err)
        })
}
exports.deleteUsers = (req, res, next) => {
    const { username } = req.params
    terminateUsers(username).then((deleted_user) => {
        res.status(204).send({})
    })
        .catch((err) => {
            next(err)
        })
}
exports.deletePlaylistSongs = (req, res, next) => {
    const { username, playlist_id, song_id } = req.params
    terminatePlaylistSongs(username, playlist_id, song_id).then((deleted_song) => {
        res.status(204).send({})
    })
        .catch((err) => {
            next(err)
        })
}