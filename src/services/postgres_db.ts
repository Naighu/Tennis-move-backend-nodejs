import 'dotenv/config';
import { Pool, PoolClient, QueryConfig, QueryResult, QueryResultRow } from 'pg';

const {
  PGHOST,
  PGPORT,
  PGUSER,
  PGPASSWORD,
  PGDATABASE,
  PGSSLMODE,
} = process.env;

export const pool = new Pool({
  host: PGHOST,
  port: PGPORT ? Number(PGPORT) : 5432,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  ssl: PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
  max: 10,            // pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

/** Simple typed helper to run parameterized queries safely */
export function query<T = any>(
  text: string | QueryConfig<any[]>,
  params?: any[]
): Promise<QueryResult<QueryResultRow>> {
  return pool.query<QueryResultRow>(text as any, params);
}

/** Transaction helper */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
pool.on('connect', () => {
  console.log(
    `PG pool connected → ${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE} as ${process.env.PGUSER}`
  );
});
// Nice-to-have logging
pool.on('error', (err) => {
  console.error('PG pool error:', err);
});
