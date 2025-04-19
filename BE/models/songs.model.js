const db = require('../db/connection')
exports.fetchSongs = () => {
    return db.query(`select * from songs`)
        .then(({ rows })=>{
            return rows
        })
}