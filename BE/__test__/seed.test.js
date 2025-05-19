const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('seed', () => {
    describe('history table exists', () => {
        test('history table exists', () => {
            return db
                .query(
                    `SELECT EXISTS (
                        SELECT FROM
                            information_schema.tables
                        WHERE
                            table_name = 'history'
                        );`
                )
                .then(({ rows: [{ exists }] }) => {
                    expect(exists).toBe(true);
                });
        })
        test('history table has history_id the primary key', () => {
            return db
                .query(
                    `SELECT column_name
                          FROM information_schema.table_constraints AS tc
                          JOIN information_schema.key_column_usage AS kcu
                          ON tc.constraint_name = kcu.constraint_name
                          WHERE tc.constraint_type = 'PRIMARY KEY'
                          AND tc.table_name = 'history';`
                )
                .then(({ rows: [{ column_name }] }) => {
                    expect(column_name).toBe('history_id');
                });
        });
        test('history table has song_id as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'history'
                        AND column_name = 'song_id';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('song_id');
                    expect(column.data_type).toBe('integer');
                })
        })
        test('history table has username as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'history'
                        AND column_name = 'username';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('username');
                    expect(column.data_type).toBe('character varying');
                })
        })
        test('history table has played_at as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'history'
                        AND column_name = 'played_at';`)
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('played_at');
                    expect(column.data_type).toBe('timestamp without time zone');
                })
        })
    })
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
                    expect(column.data_type).toBe('integer');
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
    describe('artists table', () => {
        test('artists table exists', () => {
            return db
                .query(
                    `SELECT EXISTS (
                        SELECT FROM 
                            information_schema.tables 
                        WHERE 
                            table_name = 'artists'
                        );`
                )
                .then(({ rows: [{ exists }] }) => {
                    expect(exists).toBe(true);
                });
        })
        test('artists table has artist_id the primary key', () => {
            return db
                .query(
                    `SELECT column_name
                          FROM information_schema.table_constraints AS tc
                          JOIN information_schema.key_column_usage AS kcu
                          ON tc.constraint_name = kcu.constraint_name
                          WHERE tc.constraint_type = 'PRIMARY KEY'
                          AND tc.table_name = 'artists';`
                )
                .then(({ rows: [{ column_name }] }) => {
                    expect(column_name).toBe('artist_id');
                });
        });
        test('artists table has artists_name as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'artists'
                        AND column_name = 'artists_name';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('artists_name');
                    expect(column.data_type).toBe('character varying');
                })
        })
    })
    describe('users table', () => {
        test('users table exists', () => {
            return db
                .query(
                    `SELECT EXISTS (
                        SELECT FROM 
                            information_schema.tables 
                        WHERE 
                            table_name = 'users'
                        );`
                )
                .then(({ rows: [{ exists }] }) => {
                    expect(exists).toBe(true);
                });
        })
        test('users table has username the primary key', () => {
            return db
                .query(
                    `SELECT column_name
                          FROM information_schema.table_constraints AS tc
                          JOIN information_schema.key_column_usage AS kcu
                          ON tc.constraint_name = kcu.constraint_name
                          WHERE tc.constraint_type = 'PRIMARY KEY'
                          AND tc.table_name = 'users';`
                )
                .then(({ rows: [{ column_name }] }) => {
                    expect(column_name).toBe('username');
                });
        });
        test('users table has email as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'users'
                        AND column_name = 'email';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('email');
                    expect(column.data_type).toBe('text');
                })
        })
        test('users table has password as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'users'
                        AND column_name = 'password';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('password');
                    expect(column.data_type).toBe('text');
                })
        })
        test('users table has avatar_url as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'users'
                        AND column_name = 'avatar_url';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('avatar_url');
                    expect(column.data_type).toBe('text');
                })
        })
    })
    describe('playlist table', () => {
        test('playlist table exists', () => {
            return db
                .query(
                    `SELECT EXISTS (
                        SELECT FROM 
                            information_schema.tables 
                        WHERE 
                            table_name = 'playlist'
                        );`
                )
                .then(({ rows: [{ exists }] }) => {
                    expect(exists).toBe(true);
                });
        })
        test('playlist table has playlist_id the primary key', () => {
            return db
                .query(
                    `SELECT column_name
                          FROM information_schema.table_constraints AS tc
                          JOIN information_schema.key_column_usage AS kcu
                          ON tc.constraint_name = kcu.constraint_name
                          WHERE tc.constraint_type = 'PRIMARY KEY'
                          AND tc.table_name = 'playlist'`
                )
                .then(({ rows: [{ column_name }] }) => {
                    expect(column_name).toBe('playlist_id');
                });
        });
        test('playlist table has name as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'playlist'
                        AND column_name = 'name';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('name');
                    expect(column.data_type).toBe('text');
                })
        })
        test('playlist table has user_id as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'playlist'
                        AND column_name = 'user_id';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('user_id');
                    expect(column.data_type).toBe('character varying');
                })
        })
        test('playlist table has avatar_url as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'playlist'
                        AND column_name = 'avatar_url';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('avatar_url');
                    expect(column.data_type).toBe('text');
                })
        })
    })
    describe('playlist_songs table', () => {
        test('playlist_songs table exists', () => {
            return db
                .query(
                    `SELECT EXISTS (
                        SELECT FROM 
                            information_schema.tables 
                        WHERE 
                            table_name = 'playlist_songs'
                        );`
                )
                .then(({ rows: [{ exists }] }) => {
                    expect(exists).toBe(true);
                });
        })
        test('playlist_songs table has song_id as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'playlist_songs'
                        AND column_name = 'song_id';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('song_id');
                    expect(column.data_type).toBe('integer');
                })
        })
        test('playlist_songs table has playlist_id as a column', () => {
            return db.query(
                `SELECT *
                        FROM information_schema.columns
                        WHERE table_name = 'playlist_songs'
                        AND column_name = 'playlist_id';`
            )
                .then(({ rows: [column] }) => {
                    expect(column.column_name).toBe('playlist_id');
                    expect(column.data_type).toBe('integer');
                })
        })

    })
    describe('data insertion', () => {
        test('artists data has been inserted correctly', () => {
            return db.query(`SELECT * FROM artists;`).then(({ rows: artists }) => {
                expect(artists).toHaveLength(2);
                artists.forEach((artist) => {
                    expect(artist).toHaveProperty('artist_id');
                    expect(artist).toHaveProperty('artists_name');
                });
            });
        })
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
        test('users data has been inserted correctly', () => {
            return db.query(`SELECT * FROM users;`).then(({ rows: users }) => {
                expect(users).toHaveLength(2);
                users.forEach((user) => {
                    expect(user).toHaveProperty('username');
                    expect(user).toHaveProperty('email');
                    expect(user).toHaveProperty('password');
                });
            });
        })
        test('playlist data has been inserted correctly', () => {
            return db.query(`SELECT * FROM playlist`).then(({ rows: playlists }) => {
                expect(playlists).toHaveLength(3);
                playlists.forEach((playlist) => {
                    expect(playlist).toHaveProperty('name');
                    expect(playlist).toHaveProperty('user_id');
                });
            });
        })
        test('playlist_songs data has been inserted correctly', () => {
            return db.query(`SELECT * FROM playlist_songs`).then(({ rows: playlist_songs }) => {
                expect(playlist_songs).toHaveLength(3);
                playlist_songs.forEach((playlist) => {
                    expect(playlist).toHaveProperty('playlist_id');
                    expect(playlist).toHaveProperty('song_id');
                });
            });
        })
        test('history data has been inserted correctly', () => {
            return db.query(`SELECT * FROM history`).then(({ rows: history }) => {
                expect(history).toHaveLength(3);
                history.forEach((hist) => {
                    expect(hist).toHaveProperty('history_id');
                    expect(hist).toHaveProperty('song_id');
                    expect(hist).toHaveProperty('username');
                    expect(hist).toHaveProperty('played_at');
                })
            })
        })
    })
})

