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
    return Response.json({ error: "Not Found" }, { status: 404 });
  }

  if (routeHandler.needsAuth && !isAuthorized(request.headers)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
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
          // return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
      }
      break;
  }
  console.log({ params });
  try {
    const res = await routeHandler.handler(prisma, params);
    console.log({ res });
    convertToSerializable(res);
    return Response.json(res, { status: 200 });
  } catch (error: unknown) {
    console.error("Error", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return Response.json(
        {
          message: error.meta?.message || error.message,
          code: error.code,
          detail: error.meta,
        },
        { status: 500 },
      );
    } else if (error instanceof Error) {
      return Response.json(error, { status: 500 });
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export default routerHandler;
