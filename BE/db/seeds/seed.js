const db = require("../connection")
const format = require('pg-format')
const bcrypt = require("bcrypt")
const { formatSongs, playlistLookup, songsLookup } = require('../seeds/utils')

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
          ON UPDATE CASCADE
        )`);
        })
        .then(() => {
            return db.query(`create table playlist_songs (
            playlist_id int REFERENCES playlist(playlist_id) ON DELETE CASCADE,
            song_id int REFERENCES songs(song_id) ON DELETE CASCADE
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
            insertedSongs = insertedSongsData.rows
            const nestedArray = usersData.map((user) => {
                const hashed = bcrypt.hashSync(user.password, 10)
                return [user.username, user.email, hashed]
            })
            const sql = format(`insert into users 
            (username, email, password)
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
        .then((insertedPlaylist) => {
            const songsLookupObj = songsLookup(insertedSongs)
            const playlistLookupObj = playlistLookup(insertedPlaylist.rows)
            const nestedArray = playlist_songs.map((pl) => {
                return [songsLookupObj[pl.song], playlistLookupObj[pl.playlist]]
            })
            const sql = format(`insert into playlist_songs
            (song_id, playlist_id)
            values
            %L
            returning *`,nestedArray)
            return db.query(sql)
        })

}
module.exports = seed