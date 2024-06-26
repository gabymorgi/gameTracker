import OpenAI from "openai";
import { OpenAIHandler } from "../../types";

const handler: OpenAIHandler = async (openai: OpenAI) => {
  const thread = await openai.beta.threads.create();
  return { threadId: thread.id };
};

export default {
  path: "create",
  handler: handler,
  needsAuth: true,
};
