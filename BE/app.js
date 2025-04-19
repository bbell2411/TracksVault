const cors = require('cors');
const express = require('express')
const db = require('./db/connection')
const app = express()
const endpoints = require('./endpoints.json')
const {getEndpoints}= require('./controllers/getEndpoints.controller');
const { getSongs } = require('./controllers/songs.controller');

app.use(cors());


app.get('/api', getEndpoints)
app.get("/api/songs", getSongs)

module.exports=app

//error handlers
//single song by id


