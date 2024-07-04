import { Prisma } from "@prisma/client";
import { $SafeAny, CustomHandler } from "../../types";

interface Params {
  batch: Array<{
    id: string;
    phrase: string;
  }>;
}

const handler: CustomHandler = async (prisma, params: Params) => {
  const transactions: Prisma.PrismaPromise<$SafeAny>[] = [];
  for (const word of params.batch) {
    transactions.push(
      prisma.phrase.create({
        data: {
          content: word.phrase,
          wordPhrases: {
            create: {
              word: {
                connect: {
                  id: word.id,
                },
              },
            },
          },
        },
      }),
    );
  }

  const phrases = await prisma.$transaction(transactions);

  return phrases;
};

export default {
  path: "create-batch",
  handler: handler,
  needsAuth: true,
};
