import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Tags {
  id: string;
  hue: string;
}

const handler: Handler = async (event) => {
  switch (event.httpMethod) {
    case "GET": {
      try {
        const tags = await prisma.tags.findMany();
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tags),
        };
      } catch (error) {
        return {
          statusCode: 500,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(error),
        };
      }
    }
    case "POST": {
      try {
        const body = JSON.parse(event.body || "[]");
        const tagPromises = body.map((tag: Tags) =>
          prisma.tags.upsert({
            where: {
              id: tag.id,
            },
            create: {
              hue: Number(tag.hue),
            },
            update: {
              hue: Number(tag.hue),
            },
          }),
        );
        const tags = await prisma.$transaction(tagPromises);
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tags),
        };
      } catch (error) {
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(error),
        };
      }
    }
    case "PUT": {
      try {
        const tag: Tags = JSON.parse(event.body || "{}");
        await prisma.tags.update({
          where: {
            id: tag.id,
          },
          data: {
            hue: Number(tag.hue),
          },
        });
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tag),
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
        const id: string = event.queryStringParameters?.id || "";
        const tag = await prisma.tags.delete({
          where: {
            id: id,
          },
        });
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tag),
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
