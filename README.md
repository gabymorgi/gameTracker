# Game tracker

## Description

This is a simple tracker that allows me to track my games, books, and other stuff.

The app can add games through Steam and update their progress.

The app is built using React.

<details style="padding-left:16px">
<summary style="font-size:24px;margin: 0 0 16px -16px">Installation</summary>

- Run `npx netlify dev` to start the app

- Open `http://localhost:8888` in your browser

</details>

<details>
<summary style="font-size:24px;margin-bottom:16px;margin-">Scripts</summary>

- Run `bun ./scripts/main.ts` to access a menu to run the scripts

### Kindle

To import words from Kindle, you need to download the words from the Kindle Mate app.

1. Right click over `vocabuary words -> Progress -> Learning`, then click on `Export to file`

2. Save the file as `txt` in `kindle-words.txt` folder

3. Run `memos - import`.

### GPT batch

1. Run `memos - openai`

If something goes wrong, you can check the batches in the OpenAI platform: https://platform.openai.com/batches

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

To backup the data, you can run `npm run script` follow the menu to select the proper option.

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

To deploy the migration to the database, run the following command:

```bash
npx prisma migrate deploy
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
npm run script #db:backup

# reset the database
npx prisma migrate reset

# deploy the migration
npm run script #db:restore

```
