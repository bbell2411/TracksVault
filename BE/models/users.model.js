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
exports.addSongs = async (username, playlist_id, song_name, artistName, link) => {
    const user = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
    if (user.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
    }

    const playlist = await db.query(`SELECT * FROM playlist WHERE playlist_id = $1`, [playlist_id]);
    if (playlist.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "playlist not found" });
    }

    let artistId;
    const artist = await db.query(`SELECT * FROM artists WHERE artists_name = $1`, [artistName]);
    if (artist.rows.length === 0) {
        const inserted = await db.query(
            `INSERT INTO artists (artists_name) VALUES ($1) RETURNING artist_id`,
            [artistName]
        );
        artistId = inserted.rows[0].artist_id;
    } else {
        artistId = artist.rows[0].artist_id;
    }

    let songId;
    const song = await db.query(`SELECT * FROM songs WHERE link = $1`, [link]);
    if (song.rows.length === 0) {
        const insertedSong = await db.query(
            `INSERT INTO songs (song_name, link, artist) VALUES ($1, $2, $3) RETURNING song_id`,
            [song_name, link, artistId]
        );
        songId = insertedSong.rows[0].song_id;
    } else {
        songId = song.rows[0].song_id;
    }
    const exists = await db.query(
        `SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2`,
        [playlist_id, songId]
    )
    if (exists.rows.length > 0) {
        return Promise.reject({ status: 409, msg: "Song already in playlist" });
    }
    const result = await db.query(
        `INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2) RETURNING *`,
        [playlist_id, songId]
    )

    return result.rows[0];
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
exports.terminatePlaylistSongs = async (username, playlist_id, song_id) => {
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
    const checkSongExists = await db.query(`select * from songs
        where song_id=$1`, [song_id])
    if (checkSongExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }
    return db.query(`delete from playlist_songs
        where playlist_id=$1
        AND song_id=$2
        returning *`, [playlist_id, song_id])
}
exports.userLoggedIn = async (username, password) => {
    const checkUserExists = await db.query(`select * from users
        where username=$1`, [username])
    if (checkUserExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }
    const user = checkUserExists.rows[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return Promise.reject({ status: 401, msg: "incorrect information" })
    }
    const { password: _, ...userInfo } = user;
    return userInfo

}