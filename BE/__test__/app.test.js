const endpointsJson = require("../endpoints.json");
const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const app = require('../app')
const db = require('../db/connection');
const { pass } = require("jest-extended");
const e = require("cors");

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
})

describe("GET /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body: { endpoints } }) => {
                expect(endpoints).toEqual(endpointsJson);
            });
    });
})
describe('GET /api/search', () => {
    test('200: returns songs that match search term', () => {
        return request(app)
            .get('/api/search?search_term=song one')
            .expect(200)
            .then(({ body: { search_result } }) => {
                expect(search_result).toBeInstanceOf(Array)
                expect(search_result.length).toBeGreaterThan(0)
                search_result.forEach((song) => {
                    const { song_id, song_name, link, artist_name, image } = song
                    expect(typeof song_id).toBe("number")
                    expect(typeof song_name).toBe("string")
                    expect(typeof link).toBe("string")
                    expect(typeof artist_name).toBe("string")
                    expect(typeof image).toBe("string")

                })
            })
    })
    test('400: returns error when missing search term', () => {
        return request(app)
            .get('/api/search')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: returns error when search term is empty string', () => {
        return request(app)
            .get('/api/search?search_term=')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: returns error when search term is whitespace', () => {
        return request(app)
            .get('/api/search?search_term=   ')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: returns error when search term is an empty string', () => {
        return request(app)
            .get('/api/search?search_term=')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })

    test('404: returns error when no songs match search term', () => {
        return request(app)
            .get('/api/search?search_term=notfoundjfjufrhhf')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})

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
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('404: not found error', () => {
        return request(app)
            .get('/api/playlists/338')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})

describe('GET /api/users/:username/playlists', () => {
    test("200: returns users playlists", () => {
        return request(app)
            .get('/api/users/jess202/playlists')
            .expect(200)
            .then(({ body: { playlists } }) => {
                expect(playlists.length).toBe(2)
                playlists.forEach((pl) => {
                    const { playlist_id, user_id, name } = pl
                    expect(typeof playlist_id).toBe("number")
                    expect(typeof name).toBe("string")
                    expect(user_id).toBe("jess202")
                })
            })
    })
    test("404: error if user not found", () => {
        return request(app)
            .get('/api/users/jhonny/playlists')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
describe("GET /api/playlists/:playlist_id/songs", () => {
    test('200: returns all playlist songs', () => {
        return request(app)
            .get('/api/playlists/1/songs')
            .expect(200)
            .then(({ body: { songs } }) => {
                songs.forEach((song) => {
                    const { song_id, song_name, link, playlist_name } = song
                    expect(typeof song_id).toBe("number")
                    expect(typeof song_name).toBe("string")
                    expect(typeof link).toBe("string")
                    expect(typeof playlist_name).toBe("string")
                })
            })
    })
    test('404: returns 404 err when playlist doest exist', () => {
        return request(app)
            .get('/api/playlists/78/songs')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
describe('GET /api/users/:username/history', () => {
    test('200: returns user history', () => {
        return request(app)
            .get('/api/users/jess202/history')
            .expect(200)
            .then(({ body: { history } }) => {
                expect(history.length).toBeGreaterThan(0)
                history.forEach((h) => {
                    const { history_id, username, song_id, played_at } = h
                    expect(typeof history_id).toBe("number")
                    expect(typeof username).toBe("string")
                    expect(typeof song_id).toBe("number")
                    expect(typeof played_at).toBe("string")
                })
            })
    })
    test('404: returns error when user not found', () => {
        return request(app)
            .get('/api/users/NOTjess/history')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("User not found")
            })
    })

})
describe('POST /api/users', () => {
    test('201: creates a new user', () => {
        return request(app)
            .post('/api/users')
            .send({
                username: 'bell24',
                email: 'bell@gmail.com',
                password: 'bell123'
            })
            .expect(201)
            .then(({ body: { user } }) => {
                expect(user.username).toBe('bell24')
                expect(user.email).toBe("bell@gmail.com")
                expect(user).not.toHaveProperty("password")
            })
    })
    test('400: returns error when user already exists', () => {
        return request(app)
            .post('/api/users')
            .send({
                username: 'jess202',
                email: 'bell@gmail.com',
                password: 'bell123'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("user already exists")
            })
    })
    test('400: returns error when missing required fields', () => {
        return request(app)
            .post('/api/users')
            .send({
                username: 'bell24',
                email: '',
                password: 'bell123'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("missing required fields")
            })
    })
    test('400: returns error when invalid email format', () => {
        return request(app)
            .post('/api/users')
            .send({
                username: 'bell24',
                email: 'bellgmail.com',
                password: 'bell123'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid email format")
            })
    })
    test('400: returns error when password is too short', () => {
        return request(app)
            .post('/api/users')
            .send({
                username: 'bell24',
                email: 'bell@gmail.com',
                password: '123'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("password must be at least 6 characters long")
            })
    })
    test('400: returns error when username is too short', () => {
        return request(app)
            .post('/api/users')
            .send({
                username: 'b',
                email: 'bell@gmail.com',
                password: 'bell123'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("username must be between 3 and 20 characters")
            })
    })
    test("400: returns error when keys are missing", () => {
        return request(app)
            .post('/api/users')
            .send({
                username: 'bell24',
                email: ''
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("missing required fields")
            })
    })
    test('400: rejects whitespace-only fields', () => {
        return request(app)
            .post('/api/users')
            .send({
                username: '   ',
                email: '   ',
                password: 'bell123'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("missing required fields")
            })
    })
    test('400: rejects non-string input types', () => {
        return request(app)
            .post('/api/users')
            .send({
                username: 12345,
                email: ['bad@email.com'],
                password: { pass: "nope" }
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid input types");
            })
    })
    test('400: rejects if username is too long', () => {
        return request(app)
            .post('/api/users')
            .send({
                username: 'a'.repeat(21),
                email: 'bell@gmail.com',
                password: 'bell123'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("username must be between 3 and 20 characters")
            })
    })
    test('400: rejects if email already exists', () => {
        return request(app)
            .post('/api/users')
            .send({
                username: 'bell24',
                email: 'jess202@gmail.com',
                password: 'bell123'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("email already exists")
            })
    })
})
describe('POST /api/users/:username/playlists', () => {
    test('201: creates a new playlist', () => {
        return request(app)
            .post('/api/users/jess202/playlists')
            .send({
                name: 'My Playlist',
            })
            .expect(201)
            .then(({ body: { playlist } }) => {
                expect(playlist.name).toBe('My Playlist')
                expect(playlist.playlist_id).toBe(4)
                expect(playlist.user_id).toBe('jess202')
            })
    })
    test('400: returns error when missing required fields', () => {
        return request(app)
            .post('/api/users/jess202/playlists')
            .send({
                name: '',
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("missing required fields")
            })
    })
    test('400: returns error when keys are missing', () => {
        return request(app)
            .post('/api/users/jess202/playlists')
            .send({
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("missing required fields")
            })
    })
    test('400: rejects whitespace-only fields', () => {
        return request(app)
            .post('/api/users/jess202/playlists')
            .send({
                name: '   ',
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("missing required fields")
            })
    })
    test("400: rejects playlist name that user already has", () => {
        return request(app)
            .post('/api/users/jess202/playlists')
            .send({
                name: 'playlist1',
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("playlist already exists")
            })
    })
    test('400: rejects non-string input types', () => {
        return request(app)
            .post('/api/users/jess202/playlists')
            .send({
                name: ["nice"]
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid input types");
            })
    })
    test('404: returns error if username doesnt exist', () => {
        return request(app)
            .post('/api/users/NOTjess/playlists')
            .send({
                name: "happy songs",
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
})

describe('POST /api/users/:username/playlists/:playlist_id/songs', () => {
    test('201: adds a song to a playlist', () => {
        return request(app)
            .post('/api/users/jess202/playlists/1/songs')
            .send({
                song_name: "bells cool song",
                artist: "bell",
                link: "https://www.youtube.com/watch?v=bell"
            })
            .expect(201)
            .then(({ body: { playlistSong } }) => {
                expect(playlistSong.song_id).toBe(3)
                expect(playlistSong.playlist_id).toBe(1)
            })
    })
    test('400: returns error when missing required fields', () => {
        return request(app)
            .post('/api/users/jess202/playlists/1/songs')
            .send({
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("missing required fields")
            })
    })
    test('400: returns error when keys are missing', () => {
        return request(app)
            .post('/api/users/jess202/playlists/1/songs')
            .send({
                song_name: 'bells cool song'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("missing required fields")
            })
    })
    test('400: rejects whitespace-only fields', () => {
        return request(app)
            .post('/api/users/jess202/playlists/1/songs')
            .send({
                song_id: '   ',
                song_name: '   ',
                artist: '   ',
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("missing required fields")
            })
    })
    test('400: rejects invalid input types', () => {
        return request(app)
            .post('/api/users/jess202/playlists/1/songs')
            .send({
                song_name: 123,
                artist: 123,
                link: 123
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid input types");
            })
    })
    test('404: returns error if user doesnt exist', () => {
        return request(app)
            .post('/api/users/NOTjess/playlists/1/songs')
            .send({
                song_name: "bells cool song",
                artist: "bell",
                link: "https://www.youtube.com/watch?v=bell"
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
    test('404: returns error if playlist doesnt exist', () => {
        return request(app)
            .post('/api/users/jess202/playlists/100/songs')
            .send({
                song_name: "bells cool song",
                artist: "bell",
                link: "https://www.youtube.com/watch?v=bell"
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("playlist not found");
            })
    })

})
describe("POST: /api/login", () => {
    test("200: returns user object when login is successful", () => {
        return request(app)
            .post("/api/login")
            .send({
                username: "jess202",
                password: "Jess2010"
            })
            .expect(200)
            .then(({ body }) => {
                expect(body.user.username).toBe("jess202")
                expect(body.user.email).toBe("jess202@gmail.com")
                expect(body.user).not.toHaveProperty("password")
            })
    })
    test("401: returns error message when username or password is incorrect", () => {
        return request(app)
            .post("/api/login")
            .send({
                username: "jess202",
                password: "wrongpassword"
            })
            .expect(401)
            .then(({ body }) => {
                expect(body.msg).toBe("incorrect information")
            })
    })
    test("400: returns error message when username or password is missing", () => {
        return request(app)
            .post("/api/login")
            .send({
                username: "jess202"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("missing required fields")
            })
    })
    test("404: returns error message when username does not exist", () => {
        return request(app)
            .post("/api/login")
            .send({
                username: "notjess",
                password: "wrongpassword"
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found")
            })
    })
})
describe("POST /api/signup", () => {
    test("201: returns user object when signup is successful", () => {
        return request(app)
            .post("/api/signup")
            .send({
                username: "bell24",
                email: "bell24@gmail.com",
                password: "bell123",
                avatar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM77ynl58EXAt3qUAlBrsZDnd_qvM1vIvFUA&s"
            })
            .expect(201)
            .then(({ body }) => {
                expect(body.user.username).toBe("bell24")
                expect(body.user.email).toBe("bell24@gmail.com")
                expect(body.user).not.toHaveProperty("password")
            })
    })
    test("400: returns error message when username/password/email is missing", () => {
        return request(app)
            .post("/api/signup")
            .send({
                username: "bell24",
                password: "bell123",
                avatar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM77ynl58EXAt3qUAlBrsZDnd_qvM1vIvFUA&s"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("missing required fields")
            })

    })
    test("400: returns error message when username already exists", () => {
        return request(app)
            .post("/api/signup")
            .send({
                username: "jess202",
                email: "jessy2003@gmail.com",
                password: "jessicaaaa123"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("user already exists")
            })
    })
    test("400: returns error message when email already exists", () => {
        return request(app)
            .post("/api/signup")
            .send({
                username: "bell24",
                email: "jess202@gmail.com",
                password: "passowrd2003"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("email already exists")
            })
    })
    test("400: returns error message when username is too short", () => {
        return request(app)
            .post("/api/signup")
            .send({
                username: "b",
                email: "jess495@gmail.com",
                password: "jessicaaaa123"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("username must be between 3 and 20 characters")
            })
    })
    test("400: returns error message when password is too short", () => {
        return request(app)
            .post("/api/signup")
            .send({
                username: "bell24",
                email: "jess2003@gmmail.com",
                password: "123"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("password must be at least 6 characters long")
            })
    })
    test("400: returns error message when username is too long", () => {
        return request(app)
            .post("/api/signup")
            .send({
                username: "a".repeat(21),
                email: "jess20003@gmail.com",
                password: "jessicaaaa122"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("username must be between 3 and 20 characters")
            })
    })
    test("400: returns error message when email is invalid", () => {
        return request(app)
            .post("/api/signup")
            .send({
                username: "bell24",
                email: "bell24gmail.com",
                password: "bell123"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid email format")
            })
    })
    test("400: returns error message when username contains special characters", () => {
        return request(app)
            .post("/api/signup")
            .send({
                username: "bell24@",
                email: "belkise2003@gmail.com",
                password: "bell12355"
            })
    })

})
describe("POST /api/history", () => {
    test("201: returns history object when history is added", () => {
        return request(app)
            .post("/api/history")
            .send({
                username: "jess202",
                song_id: 1,
                played_at: "2023-10-01T10:00:00Z"
            })
            .expect(201)
            .then(({ body }) => {
                expect(body.history.history_id).toBe(4)
                expect(body.history.username).toBe("jess202")
                expect(body.history.song_id).toBe(1)
                expect(body.history.played_at).toBe("2023-10-01T10:00:00.000Z")
            })
    })
    test("400: returns error message when keys are missing", () => {
        return request(app)
            .post("/api/history")
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("400: returns error message when username/song_id/played_at is missing", () => {
        return request(app)
            .post("/api/history")
            .send({
                username: "jess202",
                song_id: 1
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("400: returns error message when username does not exist", () => {
        return request(app)
            .post("/api/history")
            .send({
                username: "notjess",
                song_id: 1,
                played_at: "2023-10-01T12:00:00Z"
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("User not found")
            })
    })
    test("400: returns error message when song_id does not exist", () => {
        return request(app)
            .post("/api/history")
            .send({
                username: "jess202",
                song_id: 100,
                played_at: "2023-10-01T12:00:00Z"
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("song not found")
            })
    })
    test("400: returns error message when played_at is not a valid date", () => {
        return request(app)
            .post("/api/history")
            .send({
                username: "jess202",
                song_id: 1,
                played_at: "not a date"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid date format")
            })
    })
    test("400: returns error message when username is not a string", () => {
        return request(app)
            .post("/api/history")
            .send({
                username: 123,
                song_id: 1,
                played_at: "2023-10-01T12:00:00Z"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("400: returns error message when song_id is not a number", () => {
        return request(app)
            .post("/api/history")
            .send({
                username: "jess202",
                song_id: "not a number",
                played_at: "2023-10-01T12:00:00Z"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test("400: returns error message when played_at is not a string", () => {
        return request(app)
            .post("/api/history")
            .send({
                username: "jess202",
                song_id: 1,
                played_at: 123
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
})
describe('PATCH /api/users/:username', () => {
    test('200: updates username', () => {
        return request(app)
            .patch('/api/users/jess202')
            .send({
                new_username: 'jessy202'
            })
            .expect(200)
            .then(({ body: { updated_user } }) => {
                expect(updated_user.username).toBe('jessy202')
                expect(updated_user.email).toBe('jess202@gmail.com')
            })
    })
    test('400: returns error when missing required fields', () => {
        return request(app)
            .patch('/api/users/jess202')
            .send({
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: returns error when recieved an empty string', () => {
        return request(app)
            .patch('/api/users/jess202')
            .send({
                new_username: ''
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: rejects whitespace-only fields', () => {
        return request(app)
            .patch('/api/users/jess202')
            .send({
                new_username: '   ',
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: rejects invalid input types', () => {
        return request(app)
            .patch('/api/users/jess202')
            .send({
                new_username: 123
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid input types");
            })
    })
    test('400: rejects if username is too long', () => {
        return request(app)
            .patch('/api/users/jess202')
            .send({
                new_username: 'a'.repeat(21),
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("username must be between 3 and 20 characters")
            })
    })
    test('400: rejects if username is too short', () => {
        return request(app)
            .patch('/api/users/jess202')
            .send({
                new_username: 'a',
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("username must be between 3 and 20 characters")
            })
    })
    test('404: returns error if user doesnt exist', () => {
        return request(app)
            .patch('/api/users/NOTjess')
            .send({
                new_username: 'jessy202'
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
    test('400: returns error if username already exists', () => {
        return request(app)
            .patch('/api/users/jess202')
            .send({
                new_username: 'jess202'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("user already exists");
            })
    })
})
describe('PATCH /api/users/:username/playlists/:playlist_id', () => {
    test('200: updates playlist name', () => {
        return request(app)
            .patch('/api/users/jess202/playlists/1')
            .send({
                new_playlist_name: 'My Playlist'
            })
            .expect(200)
            .then(({ body: { updated_playlist } }) => {
                expect(updated_playlist.name).toBe('My Playlist')
                expect(updated_playlist.playlist_id).toBe(1)
                expect(updated_playlist.user_id).toBe('jess202')
            })
    })
    test('400: returns error when missing required fields', () => {
        return request(app)
            .patch('/api/users/jess202/playlists/1')
            .send({
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: returns error when recieved an empty string', () => {
        return request(app)
            .patch('/api/users/jess202/playlists/1')
            .send({
                new_playlist_name: ''
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: rejects whitespace-only fields', () => {
        return request(app)
            .patch('/api/users/jess202/playlists/1')
            .send({
                new_playlist_name: '   ',
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: rejects invalid input types', () => {
        return request(app)
            .patch('/api/users/jess202/playlists/1')
            .send({
                new_playlist_name: 123
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            })
    })
    test('404: returns error if user doesnt exist', () => {
        return request(app)
            .patch('/api/users/NOTjess/playlists/1')
            .send({
                new_playlist_name: 'My Playlist'
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
    test('404: returns error if playlist doesnt exist', () => {
        return request(app)
            .patch('/api/users/jess202/playlists/100')
            .send({
                new_playlist_name: 'My Playlist'
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
})
describe('PATCH /api/users/:username/email', () => {
    test('200: updates user email', () => {
        return request(app)
            .patch('/api/users/jess202/email')
            .send({
                email: 'newjess@gmail.com'
            })
    })
    test('400: returns error when missing required fields', () => {
        return request(app)
            .patch('/api/users/jess202/email')
            .send({
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: returns error when recieved an empty string', () => {
        return request(app)
            .patch('/api/users/jess202/email')
            .send({
                email: ''
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: rejects whitespace-only fields', () => {
        return request(app)
            .patch('/api/users/jess202/email')
            .send({
                email: '   ',
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: rejects invalid input types', () => {
        return request(app)
            .patch('/api/users/jess202/email')
            .send({
                email: 123
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            })
    })
    test('404: returns error if user doesnt exist', () => {
        return request(app)
            .patch('/api/users/NOTjess/email')
            .send({
                email: 'newjess@gmail.com'
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
    test('400: returns error if email already exists', () => {
        return request(app)
            .patch('/api/users/jess202/email')
            .send({
                email: 'jess202@gmail.com'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("email already exists");
            })
    })
    test('400: returns error if email is invalid', () => {
        return request(app)
            .patch('/api/users/jess202/email')
            .send({
                email: 'jess202gmail.com'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            })
    })
})
describe('PATCH /api/users/:username/password', () => {
    test('200: updates user password', () => {
        return request(app)
            .patch('/api/users/jess202/password')
            .send({
                old_password: 'Jess2010',
                new_password: 'newpassword'
            })
            .expect(200)
            .then(({ body: { updated_user } }) => {
                expect(updated_user.username).toBe('jess202')
                expect(updated_user).not.toHaveProperty("password")
            })
    })
    test('401: error message if user\'s old password is incorrect', () => {
        return request(app)
            .patch('/api/users/jess202/password')
            .send({
                old_password: 'wrongpassword',
                new_password: 'newpassword'
            })
            .expect(401)
            .then(({ body }) => {
                expect(body.msg).toBe("incorrect old password")
            })
    })
    test('400: returns error when missing required fields', () => {
        return request(app)
            .patch('/api/users/jess202/password')
            .send({
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: returns error when recieved an empty string', () => {
        return request(app)
            .patch('/api/users/jess202/password')
            .send({
                old_password: 'Jess2010',
                new_password: ''
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: rejects whitespace-only fields', () => {
        return request(app)
            .patch('/api/users/jess202/password')
            .send({
                old_password: 'Jess2010',
                new_password: '   ',
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request")
            })
    })
    test('400: rejects invalid input types', () => {
        return request(app)
            .patch('/api/users/jess202/password')
            .send({
                old_password: 'Jess2010',
                new_password: 123
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            })
    })
    test('404: returns error if user doesnt exist', () => {
        return request(app)
            .patch('/api/users/NOTjess/password')
            .send({
                old_password: 'Jess2010',
                new_password: 'newpassword'
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
    test('400: returns error if password is too short', () => {
        return request(app)
            .patch('/api/users/jess202/password')
            .send({
                old_password: 'Jess2010',
                new_password: '123'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("password must be at least 6 characters long");
            })
    })
})
describe('DELETE /api/users/:username/playlists/:playlist_id', () => {
    test('204: deletes user', () => {
        return request(app)
            .delete('/api/users/jess202/playlists/1')
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({})
            })
    })
    test('404: returns error if user doesnt exist', () => {
        return request(app)
            .delete('/api/users/NOTjess/playlists/1')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
    test('404: returns error if playlist doesnt exist', () => {
        return request(app)
            .delete('/api/users/jess202/playlists/100')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
    test("400: returns error if playlist_id is not a number", () => {
        return request(app)
            .delete('/api/users/jess202/playlists/playlist1')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            })
    })

})
describe('DELETE /api/users/:username', () => {
    test('204: deletes user', () => {
        return request(app)
            .delete('/api/users/jess202')
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({})
            })
    })
    test('404: returns error if user doesnt exist', () => {
        return request(app)
            .delete('/api/users/NOTjess')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
})

describe('DELETE /api/users/:username/playlists/:playlist_id/songs', () => {
    test('204: deletes song from playlist', () => {
        return request(app)
            .delete('/api/users/jess202/playlists/1/songs/2')
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({})
            })
    })
    test('404: returns error if user doesnt exist', () => {
        return request(app)
            .delete('/api/users/NOTjess/playlists/1/songs/2')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
    test('404: returns error if playlist doesnt exist', () => {
        return request(app)
            .delete('/api/users/jess202/playlists/100/songs/2')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
    test('404: returns error if song doesnt exist', () => {
        return request(app)
            .delete('/api/users/jess202/playlists/1/songs/100')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            })
    })
})

