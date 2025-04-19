const { fetchSongs }= require('../models/songs.model')

exports.getSongs = (req, res, next) => {
    fetchSongs().then((songs) => {
        res.status(200).send({ songs })
    })
        .catch((err) => {
            next(err)
        })
}

//error handle in both controller and model
// make error handing tests