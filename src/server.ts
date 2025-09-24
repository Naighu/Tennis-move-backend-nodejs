import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import { pool } from './services/postgres_db';

const PORT = Number(process.env.PORT) || 4000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
server.keepAliveTimeout = 75_000;   // align with proxies
server.headersTimeout = 76_000;
async function shutdown(signal: string) {
  console.log(`\n${signal} received: closing server…`);
  server.close(async () => {
    console.log('HTTP server closed. Closing PG pool…');
    await pool.end();
    console.log('PG pool closed. Bye!');
    process.exit(0);
  });
}
['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));
