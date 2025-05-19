const { fetchSongs, fetchSongById, searchSongs } = require('../models/songs.model')

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
exports.search = (req, res, next) => {
    const { search_term } = req.query
    if (!search_term) {
        return res.status(400).send({ msg: "bad request" })
    }
    if (search_term === '' || search_term.trim() === "") {
        return res.status(400).send({ msg: "bad request" })
    }
    searchSongs(search_term).then((search_result) => {
        res.status(200).send({ search_result })
    })
        .catch((err) => {
            next(err)
        })
}

