import { CustomHandler } from "../../types";

const handler: CustomHandler<"changelogs/bookGet"> = async (prisma, params) => {
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
  path: "bookGet",
  handler: handler,
  needsAuth: true,
};
