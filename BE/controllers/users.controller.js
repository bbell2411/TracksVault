const { fetchUsers, fetchUsersbyId, fetchUsersPlaylists, createUsers, createPlaylist } = require("../models/users.model")

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