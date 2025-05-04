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