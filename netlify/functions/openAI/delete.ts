import OpenAI from "openai";
import { OpenAIHandler } from "../../types";

interface Params {
  threadId?: string;
}

const handler: OpenAIHandler = async (openai: OpenAI, params: Params) => {
  if (!params.threadId) {
    throw new Error("thread id not provided");
  }
  return await openai.beta.threads.del(params.threadId);
};

export default {
  path: "delete",
  handler: handler,
  needsAuth: true,
};
