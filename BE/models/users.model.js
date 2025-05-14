const db = require('../db/connection')

exports.fetchUsers = () => {
    return db.query(`select * from users`)
        .then(({ rows }) => {
            return rows
        })
}
exports.fetchUsersbyId = (username) => {
    return db.query(`select * from users 
        where username=$1`, [username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "not found" })
            }
            return rows[0]
        })
}

exports.fetchUsersPlaylists = async (id) => {
    const checkUserExists = await db.query(`select * from users
        where username=$1`, [id])
    if (checkUserExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }
    return db.query(`select * from playlist
        where user_id=$1`, [id])
        .then(({ rows }) => {
            return rows
        })
}
exports.createUsers = async (username, email, password) => {

    const checkUserExists = await db.query(`select * from users
        where username=$1`, [username])
    if (checkUserExists.rows.length > 0) {
        return Promise.reject({ status: 400, msg: "user already exists" })
    }
    const checkEmailExists = await db.query(`select * from users
        where email=$1`, [email])
    if (checkEmailExists.rows.length > 0) {
        return Promise.reject({ status: 400, msg: "email already exists" })
    }
    return db.query(`insert into users (username, email, password)
        values ($1, $2, $3) returning *`, [username, email, password])
        .then(({ rows }) => {
            return rows[0]
        })
}
exports.createPlaylist = async (user_id, playlist_name) => {
    const checkUserExists = await db.query(`select * from users
        where username=$1`, [user_id])
    if (checkUserExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }
    const checkPlaylistExists = await db.query(`select * from playlist
        where user_id=$1
        and name=$2`, [user_id, playlist_name])

    if (checkPlaylistExists.rows.length > 0) {
        return Promise.reject({ status: 400, msg: "playlist already exists" })
    }
    return db.query(
        `INSERT INTO playlist (user_id, name)
         VALUES ($1, $2)
         RETURNING *`,
        [user_id, playlist_name])
        .then(({ rows }) => {
            return rows[0]
        })
}
exports.addSongs = async (user_id, playlist_id, song_id) => {
    const checkSongExists = await db.query(`select * from songs
        where song_id=$1`, [song_id])
    if (checkSongExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }

    const checkUserExists = await db.query(`select * from users
            where username=$1`, [user_id])
    if (checkUserExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }

    const checkPlaylistExists = await db.query(`select * from playlist
                where playlist_id=$1`, [playlist_id])
    if (checkPlaylistExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }
    return db.query(`insert into playlist_songs (playlist_id, song_id)
                    values ($1, $2) returning *`, [playlist_id, song_id]
    )
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.patchUsername = async (username, newUsername) => {
    const checkUserExists = await db.query(`select * from users
        where username=$1`, [username])
    if (checkUserExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }

    const checkNewUserExists = await db.query(`select * from users
        where username=$1`, [newUsername])
    if (checkNewUserExists.rows.length > 0) {
        return Promise.reject({ status: 400, msg: "user already exists" })
    }

    return db.query(`UPDATE users 
        SET username=$1
         WHERE username=$2
          RETURNING *`, [newUsername, username])
        .then(({ rows }) => {
            return rows[0]
        })
}
exports.patchPlaylistName = async (username, playlist_id, newPlaylistName) => {
    const checkUserExists = await db.query(`select * from users
        where username=$1`, [username])
    if (checkUserExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }
    const checkPlaylistExists = await db.query(`select * from playlist
        where playlist_id=$1`, [playlist_id])
    if (checkPlaylistExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }
    return db.query(`UPDATE playlist 
        SET name=$1
         WHERE playlist_id=$2
          RETURNING *`, [newPlaylistName, playlist_id])
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.patchUserEmail = async (username, email) => {
    const checkUserExists = await db.query(`select * from users
        where username=$1`, [username])
    if (checkUserExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }
    const checkEmailExists = await db.query(`select * from users
            where email=$1`, [email])
    if (checkEmailExists.rows.length > 0) {
        return Promise.reject({ status: 400, msg: "email already exists" })
    }
    return db.query(`UPDATE users 
        SET email=$1
         WHERE username=$2
          RETURNING *`, [email, username])
        .then(({ rows }) => {
            return rows[0]
        })
}
const bcrypt = require('bcrypt')

exports.patchUserPassword = async (username, oldPass, password) => {
    const checkUserExists = await db.query(`select * from users
        where username=$1`, [username])
    if (checkUserExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }
    const user = checkUserExists.rows[0]

    const isMatch = await bcrypt.compare(oldPass, user.password)
    if (!isMatch) {
        return Promise.reject({ status: 401, msg: "incorrect old password" })
    }
    return db.query(`UPDATE users 
        SET password=$1
         WHERE username=$2
          RETURNING *`, [password, username])
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.terminatePlaylist = async (username, playlist_id) => {
    const checkUserExists = await db.query(`select * from users
        where username=$1`, [username])
    if (checkUserExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }
    const checkPlaylistExists = await db.query(`select * from playlist
        where playlist_id=$1`, [playlist_id])
    if (checkPlaylistExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }
    return db.query(`delete from playlist
        where playlist_id=$1
        AND user_id=$2
        returning *`, [playlist_id, username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "not found" })
            }
            return rows[0]
        })
}
exports.terminateUsers = async (username) => {
    return db.query(`delete from users
        where username=$1
        returning *`, [username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "not found" })
            }
            return rows[0]
        })
}