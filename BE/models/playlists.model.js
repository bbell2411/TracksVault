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