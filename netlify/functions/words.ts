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
      const params: any = event.queryStringParameters || {};
      try {
        const memos = await prisma.word.findMany({
          where: {
            nextPractice: {
              lt: new Date(),
            },
            definition: params?.excludeCompleted
              ? {
                  equals: null,
                }
              : undefined,
          },
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
          orderBy: [
            {
              priority: "desc",
            },
            {
              nextPractice: "asc",
            },
            {
              id: "asc",
            },
          ],
          take: params?.limit ? Number(params.limit) : 24,
        });

        const parsed = memos.map((memo) => ({
          id: memo.id,
          word: memo.value,
          phrases: memo.wordPhrases.map((wordPhrase) => ({
            id: wordPhrase.phrase.id,
            content: wordPhrase.phrase.content,
            translation: wordPhrase.phrase.translation,
          })),
          definition: memo.definition,
          pronunciation: memo.pronunciation,
          priority: memo.priority,
          practiceWord: memo.practiceWord,
          practicePhrase: memo.practicePhrase,
          practicePronunciation: memo.practicePronunciation,
          practiceListening: memo.practiceListening,
          practiceTranslation: memo.practiceTranslation,
          nextPractice: memo.nextPractice,
        }));

        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
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
                    increment: Number(memo.phrases.length) * 2,
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
          }),
        );
        const memos = await prisma.$transaction(memoPromises);
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
        const word: Memo = JSON.parse(event.body || "{}");
        const memo = await prisma.word.upsert({
          where: {
            id: word.id || "",
          },
          create: {
            value: word.word,
            priority: word.priority ? Number(word.priority) : undefined,
            practiceListening: 0,
            practicePhrase: 0,
            practicePronunciation: 0,
            practiceTranslation: 0,
            practiceWord: 0,
            pronunciation: word.pronunciation,
            definition: word.definition,
            nextPractice: new Date(),
          },
          update: {
            priority: word.priority ? Number(word.priority) : undefined,
            practiceListening: word.practiceListening
              ? Number(word.practiceListening)
              : undefined,
            practicePhrase: word.practicePhrase
              ? Number(word.practicePhrase)
              : undefined,
            practicePronunciation: word.practicePronunciation
              ? Number(word.practicePronunciation)
              : undefined,
            practiceTranslation: word.practiceTranslation
              ? Number(word.practiceTranslation)
              : undefined,
            practiceWord: word.practiceWord
              ? Number(word.practiceWord)
              : undefined,
            pronunciation: word.pronunciation,
            definition: word.definition,
            nextPractice: addDays(
              new Date(),
              word.practiceWord
                ? Math.ceil(
                    Number(word.practiceWord) +
                      Number(word.practicePhrase) +
                      Number(word.practicePronunciation) +
                      Number(word.practiceListening) +
                      Number(word.practiceTranslation),
                  )
                : 1,
            ),
          },
        });
        if (word.phrases) {
          const prevPhrases = await prisma.phrase.findMany({
            where: {
              wordPhrases: {
                some: {
                  wordId: memo.id || "",
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
              !word.phrases.some((phrase) => phrase.id === prevPhrase.id),
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
        const learned: boolean =
          event.queryStringParameters?.learned === "true";
        const phrasesToDelete = await prisma.phrase.findMany({
          where: {
            wordPhrases: {
              some: {
                wordId: id,
              },
            },
          },
          select: {
            id: true,
          },
        });
        const wordPhrases = await prisma.wordPhrase.deleteMany({
          where: {
            wordId: id,
          },
        });
        const phrases = await prisma.phrase.deleteMany({
          where: {
            id: {
              in: phrasesToDelete.map((phrase) => phrase.id),
            },
          },
        });
        const memo = await prisma.word.delete({
          where: {
            id: id,
          },
        });
        if (learned) {
          await prisma.tags.upsert({
            where: {
              id: "learned",
            },
            create: {
              hue: 1,
            },
            update: {
              hue: {
                increment: 1,
              },
            },
          });
        }
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
