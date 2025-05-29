import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tracksvault.onrender.com/api',
})

export const getPlaylists = () => {
  return API.get('/playlists')
    .then(({ data }) => {
      return data
    })
}

export const getPlaylistSongs = (playlistId) => {
  return API.get(`/playlists/${playlistId}/songs`)
    .then(({ data }) => {
      return data
    })
}

 export const getUsersByPlaylistId = (playlistId) => {
  return API.get(`/playlists/${playlistId}`)
    .then(({ data }) => {
      return data
    })
    
  }
  
  export const getUser = (userId) => {
    return API.get(`/users/${userId}`)
    .then(({ data }) => {
      return data
    })
}

export const getSong = (songId) => {
  return API.get(`/songs/${songId}`)
    .then(({ data }) => {
      return data
    })
}

export const getArtist = (artistId) => {
  return API.get(`/artists/${artistId}`)
    .then(({ data }) => {
      return data
    })
}

export const prev = (songName) => {
  return API.get(`/deezer/search/${encodeURIComponent(songName)}`)
    .then(({ data }) => {
      console.log(data)
      return data
    })
}