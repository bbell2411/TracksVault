exports.ArtistsLookup = (artistsData) => {
  if (artistsData.length === 0) {
    return {}
  }
  const res = {}
  for (let i = 0; i < artistsData.length; i++) {
    res[artistsData[i].artists_name] = artistsData[i].artist_id
  }
  return res
}
exports.songsLookup = (songsData) => {
  if (songsData.length === 0) {
    return {}
  }
  const res = {}
  for (let i = 0; i < songsData.length; i++) {
    res[songsData[i].song_name] = songsData[i].song_id
  }
  return res
}
exports.playlistLookup = (playlist) => {
  if (playlist.length === 0) {
    return {}
  }
  const res = {}
  for (let i = 0; i < playlist.length; i++) {
    res[playlist[i].name] = playlist[i].playlist_id
  }
  return res
}

exports.formatSongs = (songs, artists) => {
  if (artists.length === 0) {
    return []
  }
  const songsCopy = [...songs]
  const artistsCopy = [...artists]
  const formattedData = []
  const lookupObj = this.ArtistsLookup(artistsCopy)

  for (let i = 0; i < songsCopy.length; i++) {
    const song = songsCopy[i]
    song.artist_id = lookupObj[song.artist]
    formattedData.push(song)
  }
  return formattedData
}
exports.playlistSongsFormat = (playlist, songs) => {
  if (songs.length === 0) {
    return []
  }
  const playlistCopy = [...playlist]
  const songsCopy = [...songs]
  const formattedData = []
  const lookupObj = this.songsLookup(songsCopy)

  for (let i = 0; i < playlistCopy.length; i++) {
    const pl = playlistCopy[i]
    pl.song_id = lookupObj[pl.song]
    formattedData.push(pl)
  }
  return formattedData
}