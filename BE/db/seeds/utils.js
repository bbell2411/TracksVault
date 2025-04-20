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