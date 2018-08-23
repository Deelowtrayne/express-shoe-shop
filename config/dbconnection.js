const pg = require('pg');

module.exports = function () {
    const Pool = pg.Pool;

    let useSSL = false;
    if (process.env.DATABASE_URL) {
        useSSL = true;
    }
    const connectionString = process.env.DATABASE_URL || 'postgresql://coder123:coder132@localhost:5432/shoe_api';

    const pool = new Pool({
        connectionString,
        ssl: useSSL
    });

    return pool;
}