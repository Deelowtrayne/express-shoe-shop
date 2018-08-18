const pg = require('pg');

module.exports = function () {
    const Pool = pg.Pool;

    let useSSL = false;
    if (process.env.DATABASE_URL) {
        useSSL = true;
    }
    const connectionString = process.env.DATABASE_URL || 'postgresql://deelowtrayne:nomawonga@localhost:5432/shoe_catalogue';

    const pool = new Pool({
        connectionString,
        ssl: useSSL
    });

    return pool;
}