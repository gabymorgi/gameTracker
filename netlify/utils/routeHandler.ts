import { $SafeAny, GenericObject, RouteHandler } from "../types";
import isAuthorized from "../auth/isAuthorized";
import { Prisma, PrismaClient } from "@prisma/client";
import { Context } from "@netlify/functions";
import { CustomError } from "./error";

const prisma = new PrismaClient();

function convertToSerializable(obj: $SafeAny) {
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
  // get the last fragment of the path as the queryPath
  const queryPath = new URL(request.url).pathname.split("/").pop();
  const routeHandler = routeHandlers.find(
    (handler) => handler.path === queryPath,
  );
  if (!routeHandler) {
    return Response.json({ error: "Not Found" }, { status: 404 });
  }

  if (routeHandler.needsAuth && !isAuthorized(request.headers)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let params: GenericObject = {};
  if (request.body) {
    try {
      params = await request.json();
    } catch (error: unknown) {
      console.error({ error: "Invalid JSON" });
      console.error("Error", error);
      // return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }
  }
  try {
    const res = await routeHandler.handler(prisma, params);
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
    } else if (error instanceof CustomError) {
      return Response.json(
        { message: error.message },
        { status: error.status },
      );
    } else if (error instanceof Error) {
      return Response.json(error, { status: 500 });
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export default routerHandler;
