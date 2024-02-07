import { CustomHandler } from "../../../types";

interface UrlParams {
  id: string;
}

const learnHandler: CustomHandler = async (prisma, urlParams: UrlParams) => {
  const word = await prisma.word.update({
    where: { id: urlParams.id },
    data: { priority: -1 },
  });
  return word;
};

export default {
  path: "words/learn/:id",
  handler: learnHandler,
  needsAuth: true,
};
