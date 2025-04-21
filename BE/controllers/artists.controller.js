const { fetchArtists, fetchArtistsById } = require("../models/artists.model")

exports.getArtists = (req, res, next) => {
    fetchArtists().then((artists) => {
        res.status(200).send({ artists })
    })
        .catch((err) => {
            next(err)
        })
}
exports.getArtistsById = (req, res, next) => {
    const { artist_id } = req.params
    fetchArtistsById(artist_id).then((artist) => {
        res.status(200).send({ artist })
    })
        .catch((err) => {
            next(err)
        })
}