import { Prisma } from "@prisma/client";
import { CustomHandler } from "../../types";

interface Params {
  batch: Array<{
    id: string;
    definition: string;
    pronunciation: string;
  }>;
}

const handler: CustomHandler = async (prisma, params: Params) => {
  const transactions: Prisma.PrismaPromise<any>[] = [];
  for (const word of params.batch) {
    transactions.push(
      prisma.word.update({
        where: {
          id: word.id,
        },
        data: {
          pronunciation: word.pronunciation,
          definition: word.definition,
        },
      }),
    );
  }

  const words = await prisma.$transaction(transactions);

  return words;
};

export default {
  path: "definition-batch",
  handler: handler,
  needsAuth: true,
};
