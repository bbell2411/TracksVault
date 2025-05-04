const db = require('../db/connection')

exports.fetchPlaylists = () => {
    return db.query(`select * from playlist`)
        .then(({ rows }) => {
            return rows
        })
}
exports.fetchPlaylistById = (id) => {
    return db.query(`select * from playlist 
        where playlist_id=$1`, [id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "not found" })
            }
            return rows[0]
        })
}

exports.fetchPlaylistSongs = async (id) => {
    const checkPlaylistExists = await db.query(`select * from playlist
        where playlist_id=$1`, [id])
    if (checkPlaylistExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" })
    }
    return db.query(`SELECT songs.*, playlist.name AS playlist_name
FROM songs
JOIN playlist_songs ON songs.song_id = playlist_songs.song_id
JOIN playlist ON playlist.playlist_id = playlist_songs.playlist_id
WHERE playlist.playlist_id = $1`, [id])
.then(({rows})=>{
    return rows
})
}