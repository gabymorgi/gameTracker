import { Prisma } from "@prisma/client";
import { $SafeAny, CustomHandler } from "../../types";

const handler: CustomHandler<"books/update"> = async (prisma, book) => {
  if (book.changelogs) {
    const transactions: Prisma.PrismaPromise<$SafeAny>[] = [];
    if (book.changelogs.create.length > 0) {
      transactions.push(
        prisma.bookChangelog.createMany({
          data: book.changelogs.create.map((changelog) => ({
            createdAt: changelog.createdAt,
            words: changelog.words,
            bookId: book.id!,
          })),
        }),
      );
    }
    if (book.changelogs.update.length > 0) {
      for (const changelog of book.changelogs.update) {
        transactions.push(
          prisma.bookChangelog.update({
            where: { id: changelog.id },
            data: {
              createdAt: changelog.createdAt,
              words: changelog.words,
            },
          }),
        );
      }
    }
    if (book.changelogs.delete.length > 0) {
      transactions.push(
        prisma.bookChangelog.deleteMany({
          where: {
            id: {
              in: book.changelogs.delete,
            },
          },
        }),
      );
    }
    await prisma.$transaction(transactions);
  }

  if (
    [
      "name",
      "start",
      "end",
      "language",
      "saga",
      "state",
      "words",
      "mark",
      "review",
      "imageUrl",
    ].some((key) => book.hasOwnProperty(key))
  ) {
    const updatedBook = await prisma.book.update({
      where: { id: book.id },
      data: {
        name: book.name,
        start: book.start,
        end: book.end,
        language: book.language,
        saga: book.saga,
        state: book.state,
        words: book.words,
        mark: book.mark,
        review: book.review,
        imageUrl: book.imageUrl,
      },
    });
    return updatedBook;
  } else {
    const updatedBook = await prisma.book.findUniqueOrThrow({
      where: { id: book.id },
    });
    return updatedBook;
  }
};

export default {
  path: "update",
  handler: handler,
  needsAuth: true,
};
