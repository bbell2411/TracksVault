const cors = require('cors');
const express = require('express')
const db = require('./db/connection')
const app = express()
const endpoints = require('./endpoints.json')
const { getEndpoints } = require('./controllers/getEndpoints.controller');
const { getSongs, getSongById } = require('./controllers/songs.controller');
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./controllers/errorHandler.controller');
const { getArtists, getArtistsById } = require('./controllers/artists.controller');

app.use(cors());


app.get('/api', getEndpoints)
app.get("/api/songs", getSongs)
app.get("/api/songs/:song_id", getSongById)
app.get("/api/artists", getArtists)
app.get("/api/artists/:artist_id", getArtistsById)



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
