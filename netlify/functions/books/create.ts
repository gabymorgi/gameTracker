import { CustomHandler } from "../../types";

const createHandler: CustomHandler<"books/create"> = async (prisma, book) => {
  const createdBook = await prisma.book.create({
    data: {
      saga: book.saga,
      language: book.language,
      name: book.name,
      start: book.start,
      end: book.end,
      words: book.words,
      mark: book.mark,
      review: book.review,
      state: book.state,
      imageUrl: book.imageUrl,
      changelogs: book.changelogs
        ? {
            createMany: {
              data: book.changelogs.create.map((changelog) => ({
                createdAt: changelog.createdAt,
                words: changelog.words,
              })),
            },
          }
        : undefined,
    },
  });

  return createdBook;
};

export default {
  path: "create",
  handler: createHandler,
  needsAuth: true,
};
