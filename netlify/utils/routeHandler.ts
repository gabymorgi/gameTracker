import { Event } from "@netlify/functions/dist/function/event";
import { GenericObject, RouteHandlers } from "../types";
import isAuthorized from "../auth/isAuthorized";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Función para extraer parámetros de rutas dinámicas
const extractParams = (pattern: string, path: string) => {
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");

  return patternParts.reduce((params, part, index) => {
    if (part.startsWith(":")) {
      params[part.slice(1)] = pathParts[index];
    }
    return params;
  }, {});
};

const routerHandler = async (
  event: Event,
  routeHandlers: Array<RouteHandlers>,
) => {
  const path = event.path.match("/[^/]*/[^/]*/[^/]*/(.+)")?.[1];

  if (!path) {
    return {
      statusCode: 404,
      body: "Not Found",
      headers: { "Content-Type": "application/json" },
    };
  }

  for (const routeHandler of routeHandlers) {
    const regex = new RegExp(
      "^" + routeHandler.path.replace(/:\w+/g, "([^/]+)") + "$",
    );
    if (path.match(regex)) {
      if (routeHandler.needsAuth && !isAuthorized(event.headers)) {
        return {
          statusCode: 401,
          body: "Unauthorized",
          headers: { "Content-Type": "application/json" },
        };
      }

      // Si es una ruta dinámica, extraer los parámetros
      let urlParams: GenericObject = {};
      if (routeHandler.path.includes(":")) {
        urlParams = extractParams(routeHandler.path, path);
      }

      let params: GenericObject = {};
      switch (event.httpMethod) {
        case "GET":
        case "HEAD":
          params = event.queryStringParameters || {};
          break;
        case "POST":
        case "PUT":
        case "PATCH":
        case "DELETE":
          params = JSON.parse(event.body || "{}");
          break;
      }
      try {
        const res = await routeHandler.handler(prisma, urlParams, params);
        return {
          statusCode: 200,
          body: JSON.stringify(res, (_, value) =>
            typeof value === "bigint" ? Number(value) : value,
          ),
          headers: { "Content-Type": "application/json" },
        };
      } catch (error) {
        console.error("Error", error);
        return {
          statusCode: 500,
          body: JSON.stringify(error),
          headers: { "Content-Type": "application/json" },
        };
      }
    }
  }

  // Retornar 404 si no se encuentra un handler para la ruta
  return {
    statusCode: 404,
    body: "Not Found",
    headers: { "Content-Type": "application/json" },
  };
};

export default routerHandler;
