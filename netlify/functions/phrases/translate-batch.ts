import { Prisma } from "@prisma/client";
import { $SafeAny, CustomHandler } from "../../types";

interface Params {
  batch: Array<{
    id: string;
    translation: string;
  }>;
}

const handler: CustomHandler = async (prisma, params: Params) => {
  const transactions: Prisma.PrismaPromise<$SafeAny>[] = [];
  for (const phrase of params.batch) {
    transactions.push(
      prisma.phrase.update({
        where: {
          id: phrase.id,
        },
        data: {
          translation: phrase.translation,
        },
      }),
    );
  }

  const phrases = await prisma.$transaction(transactions);

  return phrases;
};

export default {
  path: "translate-batch",
  handler: handler,
  needsAuth: true,
};
