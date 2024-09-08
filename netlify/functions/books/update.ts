import { CustomHandler } from "../../types";

const handler: CustomHandler<"books/update"> = async (prisma, book) => {
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
};

export default {
  path: "update",
  handler: handler,
  needsAuth: true,
};
