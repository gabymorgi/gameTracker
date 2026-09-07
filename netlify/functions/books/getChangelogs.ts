import { CustomHandler } from "../../types";

const handler: CustomHandler<"books/getChangelogs"> = async (
  prisma,
  params,
) => {
  const changelogs = await prisma.bookChangelog.findMany({
    where: {
      bookId: params.bookId,
    },
    select: {
      id: true,
      createdAt: true,
      words: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return changelogs;
};

export default {
  path: "getChangelogs",
  handler: handler,
  needsAuth: true,
};
