const { fetchSongs, fetchSongById } = require('../models/songs.model')

exports.getSongs = (req, res, next) => {
    fetchSongs().then((songs) => {
        res.status(200).send({ songs })
    })
        .catch((err) => {
            next(err)
        })
}

exports.getSongById = (req, res, next) => {
    const { song_id } = req.params
    fetchSongById(song_id).then((song) => {
        res.status(200).send({ song })
    })
        .catch((err) => {
            next(err)
        })
}

