const db = require('../db/connection');
const seed = require('../db/seed/seed');
const data = require('../db/data/test-data/index');

beforeAll(() => seed(data));
afterAll(() => db.end());