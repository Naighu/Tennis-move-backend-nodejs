"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const postgres_db_1 = require("./services/postgres_db");
const PORT = Number(process.env.PORT) || 4000;
const server = http_1.default.createServer(app_1.default);
server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
async function shutdown(signal) {
    console.log(`\n${signal} received: closing server…`);
    server.close(async () => {
        console.log('HTTP server closed. Closing PG pool…');
        await postgres_db_1.pool.end();
        console.log('PG pool closed. Bye!');
        process.exit(0);
    });
}
['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));
