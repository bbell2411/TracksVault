const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('seed', () => {
    describe('songs table', () => {
        test('songs table exists', () => {
            return db
                .query(
                    `SELECT EXISTS (
                        SELECT FROM 
                            information_schema.tables 
                        WHERE 
                            table_name = 'songs'
                        );`
                )
                .then(({ rows: [{ exists }] }) => {
                    expect(exists).toBe(true);
                });
        })
        test('songs table has song_id the primary key', () => {
            return db
                .query(
                    `SELECT column_name
                          FROM information_schema.table_constraints AS tc
                          JOIN information_schema.key_column_usage AS kcu
                          ON tc.constraint_name = kcu.constraint_name
                          WHERE tc.constraint_type = 'PRIMARY KEY'
                          AND tc.table_name = 'songs';`
                )
                .then(({ rows: [{ column_name }] }) => {
                    expect(column_name).toBe('song_id');
                });
        });

        test('songs table has song_name as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'songs'
                        AND column_name = 'song_name';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('song_name');
                    expect(column.data_type).toBe('text');
                })
        })
        test('songs table has artist as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'songs'
                        AND column_name = 'artist';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('artist');
                    expect(column.data_type).toBe('text');
                })
        })
        test('songs table has link as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'songs'
                        AND column_name = 'link';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('link');
                    expect(column.data_type).toBe('text');
                })
        })
    })
    describe('data insertion', () => {
        test('songs data has been inserted correctly', () => {
            return db.query(`SELECT * FROM songs;`).then(({ rows: songs }) => {
                expect(songs).toHaveLength(2);
                songs.forEach((song) => {
                    expect(song).toHaveProperty('song_id');
                    expect(song).toHaveProperty('song_name');
                    expect(song).toHaveProperty('artist');
                    expect(song).toHaveProperty('link');
                });
            });
        })
    })
})