"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.query = query;
exports.withTransaction = withTransaction;
require("dotenv/config");
const pg_1 = require("pg");
const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE, PGSSLMODE, } = process.env;
exports.pool = new pg_1.Pool({
    host: PGHOST,
    port: PGPORT ? Number(PGPORT) : 5432,
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    ssl: PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
    max: 10, // pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});
/** Simple typed helper to run parameterized queries safely */
function query(text, params) {
    return exports.pool.query(text, params);
}
/** Transaction helper */
async function withTransaction(fn) {
    const client = await exports.pool.connect();
    try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
}
exports.pool.on('connect', () => {
    console.log(`PG pool connected → ${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE} as ${process.env.PGUSER}`);
});
// Nice-to-have logging
exports.pool.on('error', (err) => {
    console.error('PG pool error:', err);
});
