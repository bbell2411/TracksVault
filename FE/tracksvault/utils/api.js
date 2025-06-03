import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tracksvault.onrender.com/api',
})

export function getPlaylists(){
  return API.get('/playlists')
    .then(({ data }) => {
      return data
    })
}

export function getPlaylistSongs(playlistId){
  return API.get(`/playlists/${playlistId}/songs`)
    .then(({ data }) => {
      return data
    })
}

 export function getUsersByPlaylistId(playlistId){
  return API.get(`/playlists/${playlistId}`)
    .then(({ data }) => {
      return data
    })
    
  }
  
  export function getUser(userId){
    return API.get(`/users/${userId}`)
    .then(({ data }) => {
      return data
    })
}

export function getSong(songId){
  return API.get(`/songs/${songId}`)
    .then(({ data }) => {
      return data
    })
}

export function  getArtist(artistId){
  return API.get(`/artists/${artistId}`)
    .then(({ data }) => {
      return data
    })
}

export function handleSearch(searchQuery){
  return API.get(`/search?search_term=${searchQuery}`)
  .then(({data})=>{
    return data
  })
}
// /search?search_term=song one