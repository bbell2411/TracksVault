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