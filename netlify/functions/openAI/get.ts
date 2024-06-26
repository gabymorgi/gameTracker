import OpenAI from "openai";
import { OpenAIHandler } from "../../types";

interface Params {
  runId?: string;
  threadId?: string;
}

const handler: OpenAIHandler = async (openai: OpenAI, params: Params) => {
  if (!params.threadId) {
    throw new Error("threadId is required");
  }
  const { runId, threadId } = params;
  let completed = !runId;
  if (runId) {
    const res = await openai.beta.threads.runs.retrieve(threadId, runId);
    if (res.status === "completed") {
      completed = true;
    } else {
      return { completed, runId };
    }
  }
  const lastMessages = await openai.beta.threads.messages.list(threadId);
  return { completed, runId, messages: lastMessages.data };
};

export default {
  path: "get",
  handler: handler,
  needsAuth: true,
};
