import { GenericObject, RouteHandler } from "../types";
import isAuthorized from "../auth/isAuthorized";
import { Prisma, PrismaClient } from "@prisma/client";
import { Context } from "@netlify/functions";

const prisma = new PrismaClient();

function convertToSerializable(obj: any) {
  for (const key in obj) {
    if (typeof obj[key] === "bigint") {
      // Convert BigInt to number if it fits otherwise to string
      obj[key] =
        Number(obj[key]) <= Number.MAX_SAFE_INTEGER
          ? Number(obj[key])
          : obj[key].toString();
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      // Recurse into object
      convertToSerializable(obj[key]);
    }
  }
}

const routerHandler = async (
  request: Request,
  context: Context,
  routeHandlers: Array<RouteHandler>,
) => {
  console.log("handling", context.params.queryPath);
  const routeHandler = routeHandlers.find(
    (handler) => handler.path === context.params.queryPath,
  );
  if (!routeHandler) {
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
    });
  }

  if (routeHandler.needsAuth && !isAuthorized(request.headers)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  let params: GenericObject = {};
  switch (request.method) {
    case "GET":
    case "HEAD":
      params = Object.fromEntries(new URL(request.url).searchParams.entries());
      break;
    case "POST":
    case "PUT":
    case "PATCH":
    case "DELETE":
      // if the request has a body, parse it as JSON
      if (request.body) {
        try {
          params = await request.json();
        } catch (error: unknown) {
          console.error({ error: "Invalid JSON" });
          console.error("Error", error);
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
          });
        }
      }
      break;
  }
  console.log({ params });
  try {
    const res = await routeHandler.handler(prisma, params);
    console.log({ res });
    convertToSerializable(res);
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error: unknown) {
    console.error("Error", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return new Response(
        JSON.stringify({
          message: error.meta?.message || error.message,
          code: error.code,
          detail: error.meta,
        }),
        { status: 500 },
      );
    } else if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export default routerHandler;
