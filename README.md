# Tennis Move Backend (Node)

A Node.js backend for the **Tennis Move** project. Runs in development and production, with generated build artifacts in `dist/`.  
**API docs** are available at `GET /docs` when the server is running.

---

## Prerequisites
- **Node.js** (v18+ recommended) and **npm**
- (Optional) **PM2** for process management in production: `npm i -g pm2`

---

## Getting Started

### 1) Clone
```bash
git clone <REPO_URL>
cd <REPO_FOLDER>
```

### 2) Install dependencies
```bash
npm i
```
### 3) Environment
Create a .env in the project root:
```bash
PORT=4000
PGHOST=127.0.0.1
PGDATABASE=postgres
PGUSER=postgres
PGPASSWORD=password
PGPORT=30
PGSSLMODE=disable
NODE_ENV=development
```

### 4) Run
```bash
npm run dev
```

## Production

### Build
```bash
npm run build
```
### Start production server
```bash
node dist/server.js
```

### Start (PM2 cluster, all CPU cores) (Recommended)
```bash
pm2 start dist/server.js -i max --name tennis-move-api
pm2 status
pm2 logs tennis-move-api
```