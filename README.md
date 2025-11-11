# Sakila Sync (MySQL -> SQLite, ORM-only)

- Node.js + TypeScript + TypeORM
- Commands: `init`, `full-load`, `incremental`, `validate`

## Setup
1. `npm i`
2. copy `.env.example` to `.env` and edit MySQL creds.
3. `npm run init`
4. `npm run full-load`
5. `npm run validate`
6. Later: `npm run incremental`

This template follows your assignment spec (dimensions/bridges/facts, surrogate keys, sync_state, timestamp-based incremental).
