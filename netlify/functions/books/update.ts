import { Prisma } from "#prisma-client";
import { $SafeAny, CustomHandler } from "../../types";

const handler: CustomHandler<"books/update"> = async (prisma, book) => {
  const changelogOps: Prisma.PrismaPromise<$SafeAny>[] = [];
  if (book.changelogs) {
    if (book.changelogs.create.length > 0) {
      changelogOps.push(
        prisma.bookChangelog.createMany({
          data: book.changelogs.create.map((changelog) => ({
            createdAt: changelog.createdAt,
            pages: changelog.pages,
            bookId: book.id!,
          })),
        }),
      );
    }
    if (book.changelogs.update.length > 0) {
      for (const changelog of book.changelogs.update) {
        changelogOps.push(
          prisma.bookChangelog.update({
            where: { id: changelog.id },
            data: {
              createdAt: changelog.createdAt,
              pages: changelog.pages,
            },
          }),
        );
      }
    }
    if (book.changelogs.delete.length > 0) {
      changelogOps.push(
        prisma.bookChangelog.deleteMany({
          where: { id: { in: book.changelogs.delete } },
        }),
      );
    }
  }

  if (changelogOps.length > 0) await prisma.$transaction(changelogOps);

  const bookData = {
    name: book.name,
    start: book.start,
    end: book.end,
    language: book.language,
    saga: book.saga,
    state: book.state,
    pages: book.pages,
    mark: book.mark,
    review: book.review,
    imageUrl: book.imageUrl,
  };

  if (Object.values(bookData).some((v) => v !== undefined)) {
    const updatedBook = await prisma.book.update({
      where: { id: book.id },
      data: bookData,
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
