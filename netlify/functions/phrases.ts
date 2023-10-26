import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

export interface Phrase {
  id: string;
  words: {
    value: string;
    priority: string;
  }[];
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
            },
          }),
        );
        const memos = await prisma.$transaction(phrasePromises);
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
    case "PUT": {
      try {
        const phrase: Phrase = JSON.parse(event.body || "{}");
        const result = await prisma.phrase.update({
          where: {
            id: phrase.id,
          },
          data: {
            translation: phrase.translation,
          },
        });

        const updatedWordTranslations = phrase.words.map((word) =>
          prisma.word.upsert({
            where: {
              value: word.value,
            },
            create: {
              value: word.value,
              priority: Number(word.priority || 0),
              wordPhrases: {
                create: {
                  phraseId: phrase.id,
                },
              },
            },
            update: {
              priority: {
                increment: 1,
              },
              wordPhrases: {
                create: {
                  phraseId: phrase.id,
                },
              },
            },
          }),
        );
        await prisma.$transaction(updatedWordTranslations);
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
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
