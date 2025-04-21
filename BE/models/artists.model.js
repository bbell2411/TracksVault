const db = require('../db/connection')

exports.fetchArtists = () => {
    return db.query(`select * from artists`)
        .then(({ rows }) => {
            return rows
        })
}
exports.fetchArtistsById = (id) => {
    return db.query(`select * from artists
        where artist_id=$1`,[id])
        .then(({ rows }) => {
            if (rows.length===0){
                return Promise.reject({status:404, msg:'not found'})
            }
            return rows[0]
        })
}