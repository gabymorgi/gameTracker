# Game tracker

## Description

This is a simple game tracker that allows me to track my games and their progress. You can add games through Steam or manually, update their progress and delete them. The app is built using React.

## Installation

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npx netlify dev` to start the app
4. Open `http://localhost:8888` in your browser

## GPT batch

To run the GPT batch, first you need to download the DB data.

go to `batch-gpt` section and download words or phrases from backend

- words: search every word with no definition

- phrases: search every phrase with no translation

Save the file in `scripts/files` folder

Then run the following command:

```bash
npm run gen-req
```

> comment the proper lines in the script if you only need to generate one type of request

The generated files will be saved as `req_[REQ_TYPE]_p[BATCH_INDEX].jsonl`

Now you can go to [OpenAI](https://platform.openai.com/batches) and upload the files to generate the batches. Download the results with format `batch_[REQ_TYPE]_output_p[BATCH_INDEX].jsonl`

The you can run the following command to parse the results:

```bash
npm run gen-req -- 8
```

> the number is the number of batches you have.
>
> comment the proper lines in the script if you only need to parse one type of request

The generated files will be saved as `parsed_[REQ_TYPE]_batch_p[REQ_TYPE].jsonl`

Go back to `batch-gpt` section and upload the parsed files to the backend.

