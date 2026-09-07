# Game tracker

## Description

This is a simple tracker that allows me to track my games, books, and other stuff.

The app can add games through Steam and update their progress.

The app is built using React.

<details style="padding-left:16px">
<summary style="font-size:24px;margin: 0 0 16px -16px">Installation</summary>

1. Install dependencies (this also runs Prisma generate via postinstall):

```bash
npm install
```

2. Ensure environment variables are set (at least `DATABASE_URL`; optional `DIRECT_URL`).

3. Run migrations in your development database:

```bash
npx prisma generate
```

4. Start the app:

```bash
npm start
```

- Open `http://localhost:8888` in your browser

</details>

<details style="padding-left:16px">
<summary style="font-size:24px;margin: 0 0 16px -16px">Local development database</summary>

To avoid running against the production database locally, run Postgres in Docker:

1. Start the container (requires Docker Desktop/WSL):

```bash
npm run db:up
```

2. Create a `.env.local` file at the repo root (gitignored). It overrides `.env` for `netlify dev`,
   Vite, Bun scripts, and the Prisma CLI:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:55432/gametracker"
DIRECT_URL="postgresql://postgres:postgres@localhost:55432/gametracker"
```

   Port `55432` is used instead of the default `5432` to avoid colliding with a native Postgres
   server that may already be running (e.g. installed in WSL per the Backup section below).

3. Apply migrations:

```bash
npx prisma migrate deploy
```

4. Generate the seed snapshots from production to `scripts/files/seed/`.
   Requires prod credentials in `.env`:

```bash
npm run scripts -- --db-p
```

5. Populate the local database from the snapshots. Dates are re-anchored:

```bash
npm run db:seed
```

- Run `npm run db:down` to stop the container. Data persists in a Docker volume across restarts.

</details>

<details>
<summary style="font-size:24px;margin-bottom:16px;margin-">Scripts</summary>

- Run `npm run scripts` to access a menu to run the scripts. This always targets the production
  database (it launches Bun with `--env-file=.env`, ignoring any local `.env.local` overrides),
  since these scripts are used for backups and bulk operations.

### Kindle

To import words from Kindle, you need to download the words from the Kindle Mate app.

1. Right click over `vocabuary words -> Progress -> Learning`, then click on `Export to file`

2. Save the file as `kindle.txt` in **UTF-8** format

3. Run `npm run scripts` and follow the menu to select `memos - import`.

### GPT batch

1. Run `npm run scripts` and follow the menu to select `memos - openai`

If something goes wrong, you can check the batches in the OpenAI platform: https://platform.openai.com/batches

- Generate requests

    The generated files will be saved as `[REQ_TYPE]_req_[BATCH_INDEX].jsonl`

2. Now you can go to [OpenAI](https://platform.openai.com/batches) and upload the files to generate the batches.

    Download the results with format `[REQ_TYPE]_batch_[BATCH_INDEX].jsonl`

3. Then you can run again `npm run scripts` and follow the menu to select the proper option to:

    - Parse requests

    - Upload to database

</details>

## Backup

### Pre-requisites

To backup the data, you need to have Postgres 15.1 installed. To do so, you can run the following commands:

```bash
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

sudo apt update

sudo apt install postgresql-15 postgresql-client-15
```

#### Troubleshooting

If you have this error:

```bash
pg_dump: error: server version: 15.1 (Ubuntu 15.1-1.pgdg20.04+1); pg_dump version: 12.19 (Ubuntu 12.19-0ubuntu0.20.04.1)
pg_dump: error: aborting because of server version mismatch
```

You can run the following command:

```bash
export PATH=/usr/lib/postgresql/15/bin:$PATH
```

### Backup

To backup the data, you can run `npm run scripts` follow the menu to select the proper option.

---
---

## Migration

To create a Prisma migration, you can run the following command:

```bash
npx prisma migrate dev --create-only --name [MIGRATION_NAME]
```

The you can edit the migration file in `prisma/migrations/[TIMESTAMP]_[MIGRATION_NAME]/migration.sql` and run the following command:

```bash
npx prisma migrate dev
```

To change the generated Typescript file, run the following command:

```bash
npx prisma generate
```

To deploy the migration to your local database, run the following command:

```bash
npx prisma migrate deploy
```

To deploy the migration to the production database (bypassing any local `.env.local` overrides),
run the following command instead:

```bash
npm run db:deploy:prod
```

### Troubleshooting

If you have this error:

```bash
- The migration `[name]` was modified after it was applied.

✔ We need to reset the "public" schema at "xxx"
Do you want to continue? All data will be lost.
```

You can run the following command:

```bash
# make a backup
npm run scripts #db:backup

# reset the database
npx prisma migrate reset

# deploy the migration
npm run scripts #db:restore

```
