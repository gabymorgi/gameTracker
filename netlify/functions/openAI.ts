import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import isAuthorized from "../auth/isAuthorized";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const handler: Handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (event.httpMethod !== "GET" && !isAuthorized(event.headers)) {
    return {
      statusCode: 401,
      headers: headers,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  switch (event.httpMethod) {
    case "GET": {
      try {
        const params: {
          runId?: string;
          threadId?: string;
        } = event.queryStringParameters || {};
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
            return {
              statusCode: 200,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ completed }),
            };
          }
        }
        const lastMessages = await openai.beta.threads.messages.list(threadId);
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completed,
            runId,
            messages: lastMessages.data,
          }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(error),
        };
      }
    }
    case "POST": {
      if (!process.env.OPENAI_ASSISTANT_ID) {
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: "OPENAI_ASSISTANT_ID is not defined",
          }),
        };
      }
      try {
        const body: {
          threadId?: string;
          message: string;
        } = JSON.parse(event.body || "{}");
        let threadId = body.threadId;
        if (!threadId) {
          const thread = await openai.beta.threads.create();
          threadId = thread.id;
        }
        const message = await openai.beta.threads.messages.create(threadId, {
          role: "user",
          content: body.message,
        });
        const run = await openai.beta.threads.runs.create(threadId, {
          assistant_id: process.env.OPENAI_ASSISTANT_ID,
        });
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            run,
            message,
            threadId,
            completed: run.status === "completed",
          }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(error),
        };
      }
    }
    case "DELETE": {
      try {
        const params: {
          threadId: string;
        } = (event.queryStringParameters || {}) as any;
        const res = await openai.beta.threads.del(params.threadId);
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(res),
        };
      } catch (error) {
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(error),
        };
      }
    }
    default: {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Method not allowed" }),
      };
    }
  }
};

export { handler };
