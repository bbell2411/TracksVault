const db = require('../db/connection')

exports.updatingHistory = async (username, song_id, played_at) => {

    const checkUserExists = await db.query(`SELECT * FROM users WHERE username = $1`,[username])
    if (checkUserExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'User not found' })
    }
    const checkSongExists = await db.query(`SELECT * FROM songs WHERE song_id = $1`,[song_id])
    if (checkSongExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'song not found' })
    }
    const sql = `INSERT INTO history (username, song_id, played_at)
    VALUES ($1, $2, $3) RETURNING *`
    const values = [username, song_id, played_at]

    return db.query(sql, values).then((result) => {
        return result.rows[0]
    })
}