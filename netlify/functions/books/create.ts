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

const createHandler: CustomHandler = async (prisma, book: BookI) => {
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
    },
  });

  return createdBook;
};

export default {
  path: "create",
  handler: createHandler,
  needsAuth: true,
};
