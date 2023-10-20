import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";
import { addDays } from "date-fns";

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
  practiceWord: string;
  practicePhrase: string;
  practicePronunciation: string;
  practiceListening: string;
  practiceTranslation: string;
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
            w."practiceWord",
            w."practicePhrase",
            w."practicePronunciation",
            w."practiceListening",
            w."practiceTranslation",
            w."nextPractice",
            array_agg(json_build_object(
              'id', p.id,
              'content', p.content,
              'translation', p.translation
            )) AS phrases
          FROM "Word" w
          JOIN "WordPhrase" wp ON w.id = wp."wordId"
          JOIN "Phrase" p ON wp."phraseId" = p.id
          WHERE w."nextPractice" < NOW()
          GROUP BY w.id
          ORDER BY
            w.priority - w."practiceWord" - w."practicePhrase" - w."practicePronunciation" - w."practiceListening" - w."practiceTranslation" DESC,
            "nextPractice" ASC
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
            practiceListening: Number(word.practiceListening),
            practicePhrase: Number(word.practicePhrase),
            practicePronunciation: Number(word.practicePronunciation),
            practiceTranslation: Number(word.practiceTranslation),
            practiceWord: Number(word.practiceWord),
            pronunciation: word.pronunciation,
            definition: word.definition,
            nextPractice: addDays(
              new Date(),
              Math.ceil(
                Number(word.practiceWord) +
                  Number(word.practicePhrase) +
                  Number(word.practicePronunciation) +
                  Number(word.practiceListening) +
                  Number(word.practiceTranslation)
              )
            ),
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
          });
          await prisma.phrase.deleteMany({
            where: {
              id: {
                in: deletePhrases.map((phrase) => phrase.id),
              },
            },
          });
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
        const wordPhrases = await prisma.wordPhrase.deleteMany({
          where: {
            wordId: id,
          },
        });
        const phrases = await prisma.phrase.deleteMany({
          where: {
            wordPhrases: {
              some: {
                wordId: id,
              },
            },
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
