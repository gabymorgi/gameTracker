import { CustomHandler } from "../../types";

const updateHandler: CustomHandler<"words/create"> = async (prisma, params) => {
  const memo = await prisma.word.create({
    data: {
      value: params.value,
      priority: params.priority,
      pronunciation: params.pronunciation,
      definition: params.definition,
      nextPractice: new Date(),
      phrases: params.phrases.create
        ? {
            create: params.phrases.create.map((phrase) => ({
              content: phrase.content,
              translation: phrase.translation,
            })),
          }
        : undefined,
    },
    include: {
      phrases: true,
    },
  });
  return memo;
};

export default {
  path: "create",
  handler: updateHandler,
  needsAuth: true,
};
