const cors = require('cors');
const express = require('express')
const db = require('./db/connection')
const app = express()
const endpoints = require('./endpoints.json')
const { getEndpoints } = require('./controllers/getEndpoints.controller');
const { getSongs, getSongById } = require('./controllers/songs.controller');
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./controllers/errorHandler.controller');
const { getArtists, getArtistsById } = require('./controllers/artists.controller');
const { getUsers, getUsersById, getUsersPlaylists, postUsers } = require('./controllers/users.controller');
const { getPlaylists, getPlaylistById, getPlaylistSongs, postPlaylists } = require('./controllers/playlist.controller');

app.use(cors());
app.use(express.json())

app.get('/api', getEndpoints)
app.get("/api/songs", getSongs)
app.get("/api/songs/:song_id", getSongById)
app.get("/api/artists", getArtists)
app.get("/api/artists/:artist_id", getArtistsById)
app.get("/api/users", getUsers)
app.get("/api/users/:username", getUsersById)
app.get('/api/playlists', getPlaylists)
app.get('/api/playlists/:playlist_id', getPlaylistById)
app.get('/api/users/:username/playlists', getUsersPlaylists)
app.get('/api/playlists/:playlist_id/songs', getPlaylistSongs)
app.post('/api/users', postUsers)
// app.post('/api/users/:username/playlists', postPlaylists)
//error handle
// POST /api/playlists – Create a new playlist

// POST /api/songs – (Optional) Add a new song manually (if not using YouTube API)

// POST /api/playlists/:playlist_id/songs – Add a song to a playlist

// PATCH /api/playlists/:playlist_id – Rename a playlist

// PATCH /api/users/:username – Update user email or details

// PATCH /api/songs/:song_id – Update song info (if editable)

// DELETE /api/playlists/:playlist_id – Delete a playlist

// DELETE /api/songs/:song_id – Delete a song (optional, if manually added)

// DELETE /api/playlists/:playlist_id/songs/:song_id – Remove a song from a playlist

// DELETE /api/users/:username – Delete a user (optional)


// GET /api/search?song=drake – Search for songs by name or artist

// GET /api/users/:username/history – (Optional) Get a user’s song listening history

// POST /api/login / POST /api/signup – (If adding authentication)
app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)


module.exports = app
// add a query like sort by most trending? or artists
// see how you can integrate youtubes api (ask)
//api call for /api/songs/:artist_id/songs ?? (+/:song_id, idk ask)
//see how we can add songs to database with post requests 
//delete 
// patch(for playlists?) (ask if we need another table)
//is yt api used in be or fe? (ask)
//LISTEN FILE?!?!?!

//ENDPOINTS.JSON
