const { ArtistsLookup, formatSongs, songsLookup, playlistSongsFormat,playlistLookup  } = require('../db/seeds/utils')

describe('articlesLookup', () => {
    test('returns empty object if array is empty', () => {
        const input = []
        const output = ArtistsLookup(input)
        expect(output).toEqual({})
    })
    test('returns object the name of artists name as the key and the id as its value for an array with one element', () => {
        const input = [{
            artist_id: 1,
            artists_name: "arists one"
        }]
        const output = ArtistsLookup(input)
        expect(output).toEqual({
            "arists one": 1
        })
    })
    test('returns object the name of artists name as the key and the id as its value for an array with multiple elements', () => {
        const input = [{
            artist_id: 1,
            artists_name: "arists one"
        },
        {
            artist_id: 2,
            artists_name: "arists two"
        }]
        const output = ArtistsLookup(input)
        expect(output).toEqual({
            "arists one": 1,
            "arists two": 2
        })
    })
})
describe('songsLookup', () => {
    test('returns empty object when array is empty', () => {
        const input = []
        const output = songsLookup(input)
        expect(output).toEqual({})
    })
    test('returns object when array has one element', () => {
        const input = [{
            song_id: 1,
            song_name: "song one",
            artist: 'artist one',
            link: "link one"

        }]
        const output = songsLookup(input)
        expect(output).toEqual({ "song one": 1 })
    })
    test('returns object when array has multiple element', () => {
        const input = [{
            song_id: 1,
            song_name: "song one",
            artist: 'artist one',
            link: "link one"
        },
        {
            song_id: 2,
            song_name: "song two",
            artist: "artist two",
            link: "link two"
        }]
        const output = songsLookup(input)
        expect(output).toEqual({
            "song one": 1,
            "song two": 2
        })
    })
})

describe('format songs', () => {
    test('returns empty array if input data is empty', () => {
        const songs = [
            {
                song: "song 1",
                artist: "artist 1"
            },
            {
                song: "song 2",
                artist: "artist 2"
            }
        ]
        const artists = []
        const output = formatSongs(songs, artists)
        expect(output).toEqual([])
    })
    test('returns correct formatted array', () => {
        const songs = [
            {
                song: "song 1",
                artist: "artist 1"
            },
            {
                song: "song 2",
                artist: "artist 2"
            }
        ]
        const artists = [
            {
                artist_id: 1,
                artists_name: "artist 1"
            },
            {
                artist_id: 2,
                artists_name: "artist 2"
            }
        ]
        const output = formatSongs(songs, artists)
        expect(output).toEqual(
            [
                {
                    artist_id: 1,
                    song: "song 1",
                    artist: "artist 1"
                },
                {
                    artist_id: 2,
                    song: "song 2",
                    artist: "artist 2"
                }
            ]
        )
    })
})
describe('format playlist songs', () => {
    test('returns empty array if input is empty', () => {
        const input1 = ["eg"]
        const input2 = []
        const output = playlistSongsFormat(input1, input2)
        expect(output).toEqual([])
    })
    test('returns formatted array with song_id in playlist obj', () => {
        const input1 = [{
            playlist: "playlist1",
            song: "song one"
        },
        {
            playlist: "playlist1",
            song: "song two"
        },
        {
            playlist: "playlist3",
            song: "song two"
        }]

        const input2 = [{
            song_id: 1,
            song_name: "song one",
            artist: 'artist one',
            link: "link one"

        },
        {
            song_id: 2,
            song_name: "song two",
            artist: "artist two",
            link: "link two"
        }]
        const output = playlistSongsFormat(input1, input2)
        expect(output).toEqual([{
            song_id: 1,
            playlist: "playlist1",
            song: "song one"
        },
        {
            song_id: 2,
            playlist: "playlist1",
            song: "song two"
        },
        {
            song_id: 2,
            playlist: "playlist3",
            song: "song two"
        }])
    })
})

describe('playlistLookup',()=>{
    test('returns object with the key as the name and id as value',()=>{
        const input=[
            {
                playlist_id:1,
                name:"playlist1",
                username:"jess202"
            },
            {
                playlist_id:2,
                name:"playlist2",
                username:"jess202"
            },
            {
                playlist_id:3,
                name:"playlist3",
                username:"james101"
            }
        ]
        const output=playlistLookup(input)
        expect(output).toEqual({
            "playlist1":1,
            "playlist2":2,
            "playlist3":3
        })
    })
})