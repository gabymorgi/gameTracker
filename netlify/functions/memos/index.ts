import type { Handler } from "@netlify/functions";
import { RouteHandlers } from "../../types";
import routerHandler from "../../utils/routeHandler";
import deletePhraseHandler from "./phrases/delete";
import getPhraseHandler from "./phrases/get";
import importPhraseHandler from "./phrases/import";

import deleteWordHandler from "./words/delete";
import findWordHandler from "./words/find";
import getWordHandler from "./words/get";
import importWordHandler from "./words/import";
import learnWordHandler from "./words/learn";
import progressWordHandler from "./words/progress";
import searchWordHandler from "./words/search";
import upsertWordHandler from "./words/upsert";

const routeHandlers: Array<RouteHandlers> = [
  deletePhraseHandler,
  getPhraseHandler,
  importPhraseHandler,
  deleteWordHandler,
  findWordHandler,
  getWordHandler,
  importWordHandler,
  learnWordHandler,
  progressWordHandler,
  searchWordHandler,
  upsertWordHandler,
];

const handler: Handler = async (event) => {
  const res = await routerHandler(event, routeHandlers);
  return res;
};

export { handler };
