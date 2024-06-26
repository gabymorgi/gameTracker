import type { Config, Context } from "@netlify/functions";
import { RouteOpenAIHandler, RouteHandler } from "../../types";
import routerHandler from "../../utils/routeHandler";

import createHandler from "./create";
import deleteHandler from "./delete";
import getHandler from "./get";
import sendHandler from "./send";
import OpenAI from "openai";

const openAIHandlers: Array<RouteOpenAIHandler> = [
  createHandler,
  deleteHandler,
  getHandler,
  sendHandler,
];

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const routeHandlers: Array<RouteHandler> = openAIHandlers.map((handler) => {
  return {
    ...handler,
    handler: async (_, params) => {
      return await handler.handler(openai, params);
    },
  };
});

const handler = async (request: Request, context: Context) => {
  return await routerHandler(request, context, routeHandlers);
};

export const config: Config = {
  path: "/api/openAI/:queryPath*",
};

export default handler;
