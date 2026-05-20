import { PrismaClient } from "@prisma/client";
import { subMonths } from "date-fns";
import type { Config } from "@netlify/functions";

const prisma = new PrismaClient();

const handler = async () => {
  const gamesToUpdate = await prisma.game.findMany({
    where: {
      state: "PLAYING",
      end: {
        lte: subMonths(new Date(), 1),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (gamesToUpdate.length > 0) {
    const res = await prisma.game.updateMany({
      where: {
        id: {
          in: gamesToUpdate.map((game) => game.id),
        },
      },
      data: {
        state: "DROPPED",
      },
    });

    await prisma.notification.create({
      data: {
        message: `Dropped ${res.count} games.\n${gamesToUpdate.map((game) => game.name).join("\n")}`,
      },
    });
  }

  const gamesToDelete = await prisma.game.findMany({
    where: {
      state: "BANNED",
      end: {
        lte: subMonths(new Date(), 1),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (gamesToDelete.length > 0) {
    const res = await prisma.game.deleteMany({
      where: {
        id: {
          in: gamesToDelete.map((game) => game.id),
        },
      },
    });
    await prisma.notification.create({
      data: {
        message: `Deleted ${res.count} games.\n${gamesToDelete.map((game) => game.name).join("\n")}`,
      },
    });
  }

  await prisma.notification.create({
    data: {
      message: `Checked for dropped games. Updated ${gamesToUpdate.length} and deleted ${gamesToDelete.length}.`,
    },
  });
};

export default handler;

export const config: Config = {
  schedule: "@monthly",
};
