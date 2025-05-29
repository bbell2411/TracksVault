const cors = require('cors');
const express = require('express')
const db = require('./db/connection')
const app = express()
const endpoints = require('./endpoints.json')
const { getEndpoints } = require('./controllers/getEndpoints.controller')
const { getSongs, getSongById, search } = require('./controllers/songs.controller');
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./controllers/errorHandler.controller');
const { getArtists, getArtistsById } = require('./controllers/artists.controller');
const { postHistory, getUsersHistory } = require('./controllers/history.controller')
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
app.get("/api/users/:username/history", getUsersHistory)
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

app.get('/api/deezer/search', async (req, res) => {
    const track = req.query.track;
    if (!track) {
      return res.status(400).json({ error: 'Missing track query parameter' });
    }
  
    try {
      const deezerResponse = await fetch(`https://api.deezer.com/search?q=track:"${encodeURIComponent(track)}"`);
      const data = await deezerResponse.json();
      res.json(data);
    } catch (error) {
      console.error('Deezer API error:', error);
      res.status(500).json({ error: 'Failed to fetch data from Deezer' });
    }
  });

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)


module.exports = app

