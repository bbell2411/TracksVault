const endpointsJson = require("../endpoints.json");
const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const app = require('../app')
const db = require('../db/connection');
const playlist = require("../db/data/test-data/playlist");

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});

describe("GET /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body: { endpoints } }) => {
                expect(endpoints).toEqual(endpointsJson);
            });
    });
});

describe('GET /api/songs', () => {
    test('200: gets songs', () => {
        return request(app)
            .get('/api/songs')
            .expect(200)
            .then(({ body }) => {
                expect(body.songs.length).toBe(2)
                body.songs.forEach((song) => {
                    const { song_name, artist, link, song_id } = song
                    expect(typeof song_id).toBe('number')
                    expect(typeof song_name).toBe('string')
                    expect(typeof artist).toBe('number')
                    expect(typeof link).toBe('string')
                })
            })

    })
})
describe('GET /api/songs/:song_id', () => {
    test('200: gets song by id', () => {
        return request(app)
            .get('/api/songs/2')
            .expect(200)
            .then(({ body: { song } }) => {
                const { song_name, artist, link, song_id } = song
                expect(song_id).toBe(2)
                expect(typeof song_name).toBe('string')
                expect(typeof artist).toBe('number')
                expect(typeof link).toBe('string')
            })
    })

    test('404: error when id not found', () => {
        return request(app)
            .get("/api/songs/10")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("song not found")
            })
    })
    test('400: error when id is invalid', () => {
        return request(app)
            .get("/api/songs/heya")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })

})
describe('GET /api/artists', () => {
    test('200: returns all artists', () => {
        return request(app)
            .get('/api/artists')
            .expect(200)
            .then(({ body: { artists } }) => {
                expect(artists.length).toBe(2)
                artists.forEach((artist) => {
                    const { artists_name, artist_id } = artist
                    expect(typeof artist_id).toBe('number')
                    expect(typeof artists_name).toBe('string')
                })
            })
    })
})

describe('GET /api/artists/:artist_id', () => {
    test('200: returns artist by id', () => {
        return request(app)
            .get('/api/artists/2')
            .expect(200)
            .then(({ body: { artist } }) => {
                const { artist_id, artists_name } = artist
                expect(artist_id).toBe(2)
                expect(typeof artists_name).toBe('string')
            })
    })
    test('404: returns error message when id not found', () => {
        return request(app)
            .get('/api/artists/383')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('not found')
            })
    })
    test('400: returns error message when id is not valid', () => {
        return request(app)
            .get('/api/artists/hola')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('bad request')
            })
    })
})
describe('GET /api/users', () => {
    test('200: returns all users', () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body: { users } }) => {
                expect(users.length).toBe(2)
                users.forEach((user) => {
                    const { username, email, password } = user
                    expect(typeof username).toBe("string")
                    expect(typeof email).toBe("string")
                    expect(typeof password).toBe("string")
                })
            })
    })
})
describe('GET /api/users/:username', () => {
    test('200: returns user by username', () => {
        return request(app)
            .get("/api/users/jess202")
            .expect(200)
            .then(({ body: { user } }) => {
                const { username, email, password } = user
                expect(username).toBe("jess202")
                expect(typeof email).toBe("string")
                expect(typeof password).toBe("string")

            })
    })
    test("404: returns 404 error if username not found", () => {
        return request(app)
            .get("/api/users/hellobjhdd")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('not found')
            })
    })
})

describe('GET /api/playlists', () => {
    test('200: returns all playlists', () => {
        return request(app)
            .get('/api/playlists')
            .expect(200)
            .then(({ body: { playlists } }) => {
                expect(playlists.length).toBe(3)
                playlists.forEach((pl) => {
                    const { playlist_id, name, user_id } = pl
                    expect(typeof name).toBe("string")
                    expect(typeof playlist_id).toBe("number")
                    expect(typeof user_id).toBe("string")
                })
            })
    })
})
describe('GET /api/playlists/:playlist_id', () => {
    test('200: returns playlist by id', () => {
        return request(app)
            .get('/api/playlists/2')
            .expect(200)
            .then(({ body: { playlist } }) => {
                const { playlist_id, name, user_id } = playlist
                expect(playlist_id).toBe(2)
                expect(typeof name).toBe("string")
                expect(typeof user_id).toBe("string")
            })
    })
    test('400: bad request error', () => {
        return request(app)
            .get('/api/playlists/sadsongs')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("bad request")
            })
    })
    test('404: not found error', () => {
        return request(app)
            .get('/api/playlists/338')
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("not found")
            })
    })
})