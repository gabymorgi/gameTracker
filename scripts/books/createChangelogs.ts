/* eslint-disable no-console */
import Prisma from "../utils/prisma.ts";
import { wait } from "../utils/promises.ts";
import { eachDayOfInterval, format, parse, startOfMonth } from "date-fns";

export default async function createChangelogs() {
  try {
    const prisma = Prisma.getInstance();
    console.log("Uploading books!");
    const books = await prisma.book.findMany({
      where: {
        state: "FINISHED",
        changelogs: {
          none: {},
        },
      },
      select: {
        id: true,
        name: true,
        start: true,
        end: true,
        words: true,
      },
    });
    console.log("Found books to upload:", books.length);
    for (const book of books) {
      const everyDay = eachDayOfInterval({
        start: book.start,
        end: book.end,
      });
      let wordsRemaining = book.words;
      const wordsPerDay = book.words / everyDay.length;
      const wordsPerMonth: Record<string, number> = {};
      everyDay.forEach((date) => {
        const month = format(date, "yyyy-MM");
        wordsPerMonth[month] = wordsPerMonth[month]
          ? wordsPerMonth[month] + wordsPerDay
          : wordsPerDay;
        wordsRemaining -= wordsPerDay;
      });
      if (wordsRemaining) {
        const lastDay = everyDay[everyDay.length - 1];
        const lastMonth = format(lastDay, "yyyy-MM");
        wordsPerMonth[lastMonth] += wordsRemaining;
      }

      await prisma.book.update({
        where: {
          id: book.id,
        },
        data: {
          changelogs: {
            createMany: {
              data: Object.entries(wordsPerMonth).map(([month, words]) => ({
                createdAt: startOfMonth(parse(month, "yyyy-MM", new Date())),
                words: words,
              })),
            },
          },
        },
      });
      console.log("Uploaded changelogs for book:", everyDay.length, book.name);
      await wait(1000);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await Prisma.disconnect();
  }
}
