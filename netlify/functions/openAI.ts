import type { Config, Context } from "@netlify/functions";
import OpenAI from "openai";
import isAuthorized from "../auth/isAuthorized";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const handler = async (request: Request, context: Context) => {
  if (request.method !== "GET" && !isAuthorized(request.headers)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  switch (request.method) {
    case "GET": {
      try {
        const params: {
          runId?: string;
          threadId?: string;
        } = Object.fromEntries(new URL(request.url).searchParams.entries());
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
            return Response.json({ completed });
          }
        }
        const lastMessages = await openai.beta.threads.messages.list(threadId);
        return Response.json({ completed, runId, messages: lastMessages.data });
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
        return Response.json(
          { error: "OPENAI_ASSISTANT_ID is not defined" },
          { status: 500 },
        );
      }
      try {
        const body: {
          threadId?: string;
          message: string;
        } = JSON.parse((await request.json()) || "{}");
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
        return Response.json({
          run,
          message,
          threadId,
          completed: run.status === "completed",
        });
      } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }
    case "DELETE": {
      try {
        const params: {
          threadId?: string;
        } = Object.fromEntries(new URL(request.url).searchParams.entries());
        if (!params.threadId) {
          throw new Error("thread id not provided");
        }
        const res = await openai.beta.threads.del(params.threadId);
        return Response.json(res);
      } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }
    default: {
      return Response.json({ message: "Method not allowed" }, { status: 405 });
    }
  }
};

export const config: Config = {
  path: "/api/openIA",
};

export default handler;
