import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

export interface Memo {
  id?: string;
  word: string;
  phrases: {
    id?: string;
    content: string;
    translation: string;
  }[];
  definition: string;
  pronunciation: string;
  priority: string;
  fails: string;
  success: string;
}

const prisma = new PrismaClient();

const handler: Handler = async (event) => {
  switch (event.httpMethod) {
    case "GET": {
      try {
        const memos = await prisma.$queryRaw`
          SELECT
            w.id,
            w.value AS word,
            w.definition,
            w.pronunciation,
            w.priority,
            w.fails,
            w.success,
            w."lastDate",
            array_agg(json_build_object(
              'id', p.id,
              'content', p.content,
              'translation', p.translation
            )) AS phrases
          FROM "Word" w
          JOIN "WordPhrase" wp ON w.id = wp."wordId"
          JOIN "Phrase" p ON wp."phraseId" = p.id
          WHERE w."lastDate" < NOW() - INTERVAL '1 day'
          GROUP BY w.id
          ORDER BY
            priority + fails - success DESC,
            "lastDate" ASC
          LIMIT 24`;
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
        console.log(body);
        const memoPromises = body.map((memo: Memo) =>
          prisma.word.upsert({
            where: {
              value: memo.word,
            },
            create: {
              value: memo.word,
              priority: memo.priority ? Number(memo.priority) : undefined,
              wordPhrases: memo.phrases
                ? {
                    create: memo.phrases.map((phrase) => ({
                      phrase: {
                        create: {
                          content: phrase.content,
                          translation: phrase.translation,
                        },
                      },
                    })),
                  }
                : undefined,
            },
            update: {
              priority: memo.phrases
                ? {
                    increment: Number(memo.phrases.length),
                  }
                : undefined,
              wordPhrases: memo.phrases
                ? {
                    create: memo.phrases.map((phrase) => ({
                      phrase: {
                        create: {
                          content: phrase.content,
                        },
                      },
                    })),
                  }
                : undefined,
              lastDate: new Date(),
            },
          })
        );
        const memos = await prisma.$transaction(memoPromises);
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
        const word: Memo = JSON.parse(event.body || "{}");
        const memo = await prisma.word.update({
          where: {
            id: word.id,
          },
          data: {
            priority: word.priority ? Number(word.priority) : undefined,
            fails: word.fails
              ? {
                  increment: Number(word.fails),
                }
              : undefined,
            success: word.success
              ? {
                  increment: Number(word.success),
                }
              : undefined,
            pronunciation: word.pronunciation,
            definition: word.definition,
            lastDate: new Date(),
          },
        });
        if (word.phrases) {
          const prevPhrases = await prisma.phrase.findMany({
            where: {
              wordPhrases: {
                some: {
                  wordId: memo.id,
                },
              },
            },
            select: {
              id: true,
            },
          });
          // Delete phrases that are not in the new list
          const deletePhrases = prevPhrases.filter(
            (prevPhrase) =>
              !word.phrases.some((phrase) => phrase.id === prevPhrase.id)
          );
          await prisma.wordPhrase.deleteMany({
            where: {
              wordId: memo.id,
              phraseId: {
                in: deletePhrases.map((phrase) => phrase.id),
              },
            },
          })
          await prisma.phrase.deleteMany({
            where: {
              id: {
                in: deletePhrases.map((phrase) => phrase.id),
              },
            },
          })
          const phrasePromises = word.phrases.map((phrase) => {
            if (phrase.id) {
              return prisma.phrase.update({
                where: {
                  id: phrase.id,
                },
                data: {
                  content: phrase.content,
                  translation: phrase.translation,
                },
              });
            } else {
              return prisma.phrase.create({
                data: {
                  content: phrase.content,
                  translation: phrase.translation,
                  wordPhrases: {
                    create: {
                      word: {
                        connect: {
                          id: memo.id,
                        },
                      },
                    },
                  },
                },
              });
            }
          });
          const phrases = await prisma.$transaction(phrasePromises);
          return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              memo,
              phrases,
            }),
          };
        }
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memo),
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
        const phrases = await prisma.phrase.deleteMany({
          where: {
            wordPhrases: {
              some: {
                wordId: id,
              },
            },
          },
        });
        const wordPhrases = await prisma.wordPhrase.deleteMany({
          where: {
            wordId: id,
          },
        });
        const memo = await prisma.word.delete({
          where: {
            value: id,
          },
        });
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memo,
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
