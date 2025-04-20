const cors = require('cors');
const express = require('express')
const db = require('./db/connection')
const app = express()
const endpoints = require('./endpoints.json')
const {getEndpoints}= require('./controllers/getEndpoints.controller');
const { getSongs, getSongById} = require('./controllers/songs.controller');
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./controllers/errorHandler.controller');

app.use(cors());


app.get('/api', getEndpoints)
app.get("/api/songs", getSongs)
app.get("/api/songs/:song_id", getSongById)


app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)


module.exports=app

//error handlers
//single song by id


