const db = require("../connection")
const format = require('pg-format')
const { formatSongs } = require('../seeds/utils')

const seed = ({ songsData, artistsData }) => {
    return db.query(`DROP TABLE IF EXISTS songs`)
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS artists`)
        })
        .then(() => {
            return db.query(`create table artists (
                artist_id serial primary key,
                artists_name varchar(150)
                )`)
        })
        .then(() => {
            return db.query(`CREATE TABLE songs (
            song_id serial primary key,
            song_name text not null,
            artist INT REFERENCES artists(artist_id) not null,
            link text
            )`)
        })
        .then(() => {
            const nestedArray = artistsData.map((artist) => {
                return [artist.artists_name]
            })
            const sql = format(`insert into artists
                (artists_name)
                values
                %L
                returning *`, nestedArray)
            return db.query(sql)
        })
        .then((artistsInserted) => {
            const nestedArray = formatSongs(songsData, artistsInserted.rows).map((song) => {
                return [song.song_name, song.artist_id, song.link]
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