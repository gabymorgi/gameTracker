import { CustomHandler } from "../../types";

const findHandler: CustomHandler<"words/find"> = async (prisma, urlParams) => {
  const word = await prisma.word.findFirst({
    where: {
      id: urlParams.id,
    },
    include: {
      phrases: true,
    },
    take: 5,
  });
  return word;
};

export default {
  path: "find",
  handler: findHandler,
  needsAuth: false,
};
