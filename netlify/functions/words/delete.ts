import { CustomHandler } from "../../types";

const deleteHandler: CustomHandler<"words/delete"> = async (
  prisma,
  urlParams,
) => {
  const phrasesToDelete = await prisma.phrase.findMany({
    where: {
      wordPhrases: {
        some: {
          wordId: urlParams.id,
        },
      },
    },
    select: {
      id: true,
    },
  });
  const wordPhrases = await prisma.wordPhrase.deleteMany({
    where: {
      wordId: urlParams.id,
    },
  });
  const phrases = await prisma.phrase.deleteMany({
    where: {
      id: {
        in: phrasesToDelete.map((phrase) => phrase.id),
      },
    },
  });
  const word = await prisma.word.delete({
    where: {
      id: urlParams.id,
    },
  });
  return {
    word,
    wordPhrases,
    phrases,
  };
};

export default {
  path: "delete",
  handler: deleteHandler,
  needsAuth: true,
};
