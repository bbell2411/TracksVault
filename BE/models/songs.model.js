const db = require('../db/connection')
exports.fetchSongs = () => {
    return db.query(`select * from songs`)
        .then(({ rows }) => {
            return rows
        })
}

exports.fetchSongById = (id) => {
    return db.query(`select * from songs 
        where song_id=$1`, [id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "song not found" })
            }
            return rows[0]
        })
}
exports.searchSongs = (search_term) => {
    return db.query(
        `SELECT songs.song_id, songs.song_name, songs.link, artists.artists_name AS artist_name
         FROM songs
         JOIN artists ON songs.artist = artists.artist_id
         WHERE songs.song_name ILIKE $1 OR artists.artists_name ILIKE $1`,
        [`%${search_term}%`]
    )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "not found" })
            }
            return rows
        })
}