import type { Handler } from "@netlify/functions";
import { Prisma, PrismaClient } from "@prisma/client";

interface QueryStringParams {
  id?: string;
  value?: string;
}

const prisma = new PrismaClient();

const handler: Handler = async (event) => {
  switch (event.httpMethod) {
    case "GET": {
      const params: QueryStringParams = event.queryStringParameters || {};
      const fields: Prisma.WordFindManyArgs = params.id
        ? {
            include: {
              wordPhrases: {
                select: {
                  phrase: {
                    select: {
                      id: true,
                      content: true,
                      translation: true,
                    },
                  },
                },
              },
            },
          }
        : {
            select: {
              id: true,
              value: true,
            },
          };
      try {
        const memos = await prisma.word.findMany({
          where: {
            id: params?.id || undefined,
            value: {
              contains: params?.value || "",
            },
          },
          ...fields,
          take: 5,
        });
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memos),
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
