const db = require("../connection")
const format = require('pg-format')
const { formatSongs, playlistSongsFormat } = require('../seeds/utils')

const seed = ({ songsData, artistsData, usersData, playlistData, playlist_songs }) => {
    let insertedSongs
    return db.query(`DROP TABLE IF EXISTS playlist_songs`)
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS playlist`)
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS users`)
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS songs`)
        })
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
            return db.query(`create table users (
            username varchar(200) primary key,
            email text unique not null,
            password text not null)`)
        })
        .then(() => {
            return db.query(`CREATE TABLE playlist (
          playlist_id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          user_id VARCHAR(200) REFERENCES users(username)
        )`);
        })
        .then(() => {
            return db.query(`create table playlist_songs (
            playlist_id int REFERENCES playlist(playlist_id),
            song_id int REFERENCES songs(song_id)
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
        .then((insertedSongsData) => {
            insertedSongs=insertedSongsData.rows
            const nestedArray = usersData.map((user) => {
                return [user.username, user.email, user.password]
            })
            const sql = format(`insert into users 
            (username, email,password)
            values 
            %L
            returning *`, nestedArray)
            return db.query(sql)

        })
        .then(() => {
            const nestedArray = playlistData.map((playlist) => {
                return [playlist.name, playlist.username]
            })
            const sql = format(`insert into playlist
                (name, user_id)
                values
                %L
                returning *`, nestedArray)
            return db.query(sql)
        })
        .then((insertedPlayistData) => {
            const nestedArray = playlistSongsFormat(playlist_songs,insertedSongs.rows).map((pl)=>{
                return [pl.song_id,pl.playlist_id]
                //make a format function for playlist
            })
        })

}
// 
// change later to hash user passwords

module.exports = seed