import OpenAI from "openai";
import { OpenAIHandler } from "../../types";

interface Params {
  runId?: string;
  threadId?: string;
  message: string;
}

const handler: OpenAIHandler = async (openai: OpenAI, params: Params) => {
  if (!params.threadId) {
    throw new Error("threadId is required");
  }
  if (!process.env.OPENAI_ASSISTANT_ID) {
    throw new Error("OPENAI_ASSISTANT_ID is not defined");
  }
  const message = await openai.beta.threads.messages.create(params.threadId, {
    role: "user",
    content: params.message,
  });
  const run = await openai.beta.threads.runs.create(params.threadId, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID,
  });
  return {
    runId: run.id,
    message,
    completed: run.status === "completed",
  };
};

export default {
  path: "send",
  handler: handler,
  needsAuth: true,
};
