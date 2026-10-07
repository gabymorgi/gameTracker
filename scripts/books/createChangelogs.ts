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
        pages: true,
      },
    });
    console.log("Found books to upload:", books.length);
    for (const book of books) {
      const everyDay = eachDayOfInterval({
        start: book.start,
        end: book.end,
      });
      const pagesPerDay = Math.floor(book.pages / everyDay.length);
      let remainingPages = book.pages % everyDay.length;
      const pagesPerMonth: Record<string, number> = {};
      everyDay.forEach((date) => {
        const month = format(date, "yyyy-MM");
        const dailyPages = pagesPerDay + (remainingPages > 0 ? 1 : 0);
        pagesPerMonth[month] = (pagesPerMonth[month] || 0) + dailyPages;
        remainingPages = Math.max(remainingPages - 1, 0);
      });

      await prisma.book.update({
        where: {
          id: book.id,
        },
        data: {
          changelogs: {
            createMany: {
              data: Object.entries(pagesPerMonth).map(([month, pages]) => ({
                createdAt: startOfMonth(parse(month, "yyyy-MM", new Date())),
                pages,
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
