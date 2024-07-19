import { BookState } from "@prisma/client";
import { CustomHandler } from "../../types";

interface BookI {
  id: string;
  name: string;
  start: string;
  state: BookState;
  end: string;
  saga: string;
  language: string;
  words: number;
  mark: number;
  review: string;
  imageUrl: string;
}

const handler: CustomHandler = async (prisma, book: BookI) => {
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
