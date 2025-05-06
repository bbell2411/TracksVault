const { fetchPlaylists, fetchPlaylistById, fetchPlaylistSongs } = require("../models/playlists.model")

exports.getPlaylists = (req, res, next) => {
    fetchPlaylists().then((playlists) => {
        res.status(200).send({ playlists })
    })
}

exports.getPlaylistById = (req, res, next) => {
    const { playlist_id } = req.params
    fetchPlaylistById(playlist_id)
        .then((playlist) => {
            res.status(200).send({ playlist })
        })
        .catch((err) => {
            next(err)
        })
}

exports.getPlaylistSongs = (req, res, next) => {
    const { playlist_id } = req.params
    fetchPlaylistSongs(playlist_id)
        .then((songs) => {
            res.status(200).send({ songs })
        })
        .catch((err) => {
            next(err)
        })
}

exports.postPlaylists = (req, res, next) => {
    
}