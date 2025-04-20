const { ArtistsLookup, formatSongs } = require('../db/seeds/utils')

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
        const output= formatSongs(songs, artists)
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
                artist_id:1,
                artists_name: "artist 1"
            },
            {
                artist_id:2,
                artists_name: "artist 2"
            }
        ]
        const output= formatSongs(songs,artists)
        expect(output).toEqual(
            [
                {
                    artist_id:1,
                    song: "song 1",
                    artist: "artist 1"
                },
                {
                    artist_id:2,
                    song: "song 2",
                    artist: "artist 2"
                }
            ]
        )
    })
})