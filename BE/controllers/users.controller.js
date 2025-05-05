const { fetchUsers, fetchUsersbyId, fetchUsersPlaylists, createUsers } = require("../models/users.model")

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
    const hashedPassword = await bcrypt.hash(password, 10)
    createUsers(username, email, hashedPassword).then((user) => {
        delete user.password
        res.status(201).send({ user })
    })
        .catch((err) => {
            next(err)
        })
}