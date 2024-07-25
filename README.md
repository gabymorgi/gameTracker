# Game tracker

## Description

This is a simple tracker that allows me to track my games, books, and other stuff.

The app can add games through Steam and update their progress.

The app is built using React.

## Installation

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npx netlify dev` to start the app
4. Open `http://localhost:8888` in your browser

---
---

## Import Words

### Kindle

To import words from Kindle, you need to download the words from the Kindle Mate app.

1. Right click over `vocabuary words -> Progress -> Learning`, then click on `Export to file`
2. Save the file as `txt` in `kindle-words.txt` folder
3. Run `npm run script` and follow the menu to select the proper option.

---
---

## GPT batch

1. Run `npm run script` and follow the menu to select the proper option to:

    - Get incomplete

    - Generate requests

    The generated files will be saved as `[REQ_TYPE]_req_[BATCH_INDEX].jsonl`

2. Now you can go to [OpenAI](https://platform.openai.com/batches) and upload the files to generate the batches.

    Download the results with format `[REQ_TYPE]_batch_[BATCH_INDEX].jsonl`

3. Then you can run again `npm run script` and follow the menu to select the proper option to:

    - Parse requests

    - Upload to database

---
---

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
