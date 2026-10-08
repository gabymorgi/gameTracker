import { CustomHandler } from "../../types";
import { bookTimelineSelect } from "../../../src/ts/api/books";

const handler: CustomHandler<"books/getTimeline"> = async (prisma, params) => {
  const changelogs = await prisma.bookChangelog.findMany({
    where: {
      createdAt: {
        gte: params.start ? new Date(params.start) : undefined,
        lte: params.end ? new Date(params.end) : undefined,
      },
      book: {
        name: params.name
          ? { contains: params.name, mode: "insensitive" }
          : undefined,
        state: params.state,
        language: params.language,
      },
    },
    select: bookTimelineSelect,
    skip: params.skip,
    take: params.take || 24,
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  });
  return changelogs;
};

export default {
  path: "getTimeline",
  handler: handler,
  needsAuth: false,
};
