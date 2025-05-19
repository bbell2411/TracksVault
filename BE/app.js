const cors = require('cors');
const express = require('express')
const db = require('./db/connection')
const app = express()
const endpoints = require('./endpoints.json')
const { getEndpoints } = require('./controllers/getEndpoints.controller')
const { getSongs, getSongById, search } = require('./controllers/songs.controller');
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./controllers/errorHandler.controller');
const { getArtists, getArtistsById } = require('./controllers/artists.controller');
const { postHistory } = require('./controllers/history.controller')
const { getUsers, getUsersById, getUsersPlaylists,
    postUsers, postPlaylists, postPlaylistSongs, userLogin, userSignup,
    updateUsername, updatePLaylistName, updateUserEmail, updateUserPassword,
    deletePlaylist, deleteUsers, deletePlaylistSongs } = require('./controllers/users.controller');
const { getPlaylists, getPlaylistById, getPlaylistSongs } = require('./controllers/playlist.controller');

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
app.get('/api/search', search)
app.post('/api/signup', userSignup)
app.post('/api/login', userLogin)
app.post('/api/users', postUsers)
app.post('/api/users/:username/playlists', postPlaylists)
app.post('/api/users/:username/playlists/:playlist_id/songs', postPlaylistSongs)
app.post('/api/history', postHistory)
app.patch("/api/users/:username", updateUsername)
app.patch('/api/users/:username/playlists/:playlist_id', updatePLaylistName)
app.patch('/api/users/:username/email', updateUserEmail)
app.patch('/api/users/:username/password', updateUserPassword)
app.delete("/api/users/:username/playlists/:playlist_id", deletePlaylist)
app.delete('/api/users/:username', deleteUsers)
app.delete('/api/users/:username/playlists/:playlist_id/songs/:song_id', deletePlaylistSongs)
// GET /api/users/:username/history – (Optional) Get a user’s song listening history

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)


module.exports = app
// add a query like sort by most trending? or artists
// see how you can integrate youtubes api (ask)
//api call for /api/songs/:artist_id/songs ?? (+/:song_id, idk ask)
//see how we can add songs to database with post requests 
//delete 
//is yt api used in be or fe? (ask)

