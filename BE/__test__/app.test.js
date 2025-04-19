const endpointsJson = require("../endpoints.json");
const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const app = require('../app')
const db = require('../db/connection')

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
                    expect(typeof artist).toBe('string')
                    expect(typeof link).toBe('string')
                })
            })

    })
})