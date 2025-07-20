import axios from 'axios';
import { use } from 'react';

const API = axios.create({
  baseURL: 'https://tracksvault.onrender.com/api',
})

export function getPlaylists() {
  return API.get('/playlists')
    .then(({ data }) => {
      return data
    })
}

export function getPlaylistSongs(playlistId) {
  return API.get(`/playlists/${playlistId}/songs`)
    .then(({ data }) => {
      return data
    })
}

export function getUsersByPlaylistId(playlistId) {
  return API.get(`/playlists/${playlistId}`)
    .then(({ data }) => {
      return data
    })

}

export function getUser(userId) {
  return API.get(`/users/${userId}`)
    .then(({ data }) => {
      return data
    })
}

export function getSong(songId) {
  return API.get(`/songs/${songId}`)
    .then(({ data }) => {
      return data
    })
}

export function getArtist(artistId) {
  return API.get(`/artists/${artistId}`)
    .then(({ data }) => {
      return data
    })
}

export function getSearch(searchQuery) {
  return API.get(`/search?search_term=${searchQuery}`)
    .then(({ data }) => {
      return data
    })
}

export function login(username, password) {
  return API.post('/login', { username, password })
    .then(({ data }) => {
      return data
    })
}

export function getUserPlaylists(username) {
  return API.get(`/users/${username}/playlists`)
    .then(({ data }) => {
      return data
    })
}

export function patchEmail(email, username) {
  return API.patch(`users/${username}/email`, { email })
    .then(({ data }) => {
      return data
    })
}


export function patchUsername(username, new_username) {
  return API.patch(`users/${username}`, { new_username })
    .then(({ data }) => {
      console.log('Username updated successfully:', data);
      return data
    })
}