const { updatingHistory } = require("../models/history.model")

exports.postHistory = (req, res, next) => {
    const { username, song_id, played_at } = req.body
    if (!username || !song_id || !played_at) {
        return res.status(400).send({ msg: 'bad request' })
    }
    if (typeof username !== 'string' || typeof song_id !== 'number' || typeof played_at !== 'string') {
        return res.status(400).send({ msg: 'bad request' })
    }
    if (played_at[10] !== 'T' || played_at[13] !== ':' || played_at[16] !== ':') {
        return res.status(400).send({ msg: 'invalid date format' })
    }
    if (played_at[4] !== '-' || played_at[7] !== '-' || played_at[13] !== ':' || played_at[16] !== ':') {
        return res.status(400).send({ msg: 'invalid date format' })
    }
    updatingHistory(username, song_id, played_at)
        .then((history) => {
            res.status(201).send({ history })
        })
        .catch((err) => {
            next(err)
        })
}