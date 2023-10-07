import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

export interface Phrase {
  id: string;
  words: string[];
  content: string;
  translation?: string;
}

const prisma = new PrismaClient();

const handler: Handler = async (event) => {
  switch (event.httpMethod) {
    case "GET": {
      try {
        const memos = await prisma.phrase.findMany({
          where: {
            wordPhrases: {
              none: {},
            },
          },
          take: 24,
        });
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memos),
        };
      } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(error),
        };
      }
    }
    case "POST": {
      try {
        const body = JSON.parse(event.body || "[]");
        const phrasePromises = body.map((phrase: Phrase) =>
          prisma.phrase.create({
            data: {
              content: phrase.content,
              translation: phrase.translation,
              wordPhrases: phrase.words ? {
                create: phrase.words.map((word) => ({
                  word: {
                    connectOrCreate: {
                      where: {
                        value: word,
                      },
                      create: {
                        value: word,
                      },
                    },
                  },
                })),
              } : undefined,
            },
          })
        );
        const memos = await prisma.$transaction(phrasePromises);
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memos),
        };
      } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(error),
        };
      }
    }
    case "PUT": {
      try {
        const phrase: Phrase = JSON.parse(event.body || "{}");
        const result = await prisma.phrase.update({
          where: {
            id: phrase.id,
          },
          data: {
            content: phrase.content,
            translation: phrase.translation,
            wordPhrases: phrase.words ? {
              create: phrase.words.map((word) => ({
                word: {
                  connectOrCreate: {
                    where: {
                      value: word,
                    },
                    create: {
                      value: word,
                    },
                  },
                },
              })),
            } : undefined,
          },
        });
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
        };
      } catch (error) {
        console.error(error);
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

        const wordPhrases = await prisma.wordPhrase.deleteMany({
          where: {
            phraseId: id,
          },
        });
        const phrases = await prisma.phrase.delete({
          where: {
            id,
          },
        });

        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phrases,
            wordPhrases,
          }),
        };
      } catch (error) {
        console.error(error);
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
