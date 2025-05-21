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