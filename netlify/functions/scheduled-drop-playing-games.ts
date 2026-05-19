import { PrismaClient } from "@prisma/client";
import { subMonths } from "date-fns";

const prisma = new PrismaClient();

const handler = async () => {
  // const gamesToUpdate = await prisma.game.findMany({
  //   where: {
  //     state: "PLAYING",
  //     end: {
  //       lte: subMonths(new Date(), 1),
  //     },
  //   },
  //   select: {
  //     id: true,
  //     name: true,
  //   },
  // });

  // if (gamesToUpdate.length > 0) {
  //   await prisma.game.updateMany({
  //     where: {
  //       id: {
  //         in: gamesToUpdate.map((game) => game.id),
  //       },
  //     },
  //     data: {
  //       state: "DROPPED",
  //     },
  //   });
  // }

  // return Response.json({
  //   updated: gamesToUpdate.length,
  //   games: gamesToUpdate,
  // });
};

export default handler;

export const config = {
  schedule: "@monthly",
};
