const db = require("../connection")
const format = require('pg-format')

const seed = ({ songsData }) => {
    return db.query(`DROP TABLE IF EXISTS songs`)
        .then(() => {
            return db.query(`CREATE TABLE songs (
            song_id serial primary key,
            song_name text not null,
            artist text not null,
            link text
            )`)
        })
        .then(() => {
            const nestedArray = songsData.map((song) => {
                return [song.song_name, song.artist, song.link]
            })
            const sql = format(`insert into songs 
            (song_name, artist, link)
            values
            %L
            returning *`, nestedArray)
            return db.query(sql)
        })
}

module.exports = seed