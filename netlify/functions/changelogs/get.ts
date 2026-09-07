import { CustomHandler } from "../../types";
import { selectChangelog } from "./utils";
import { Prisma } from "#prisma-client";

const MONTHS_PER_PAGE = 4;
const CHANGELOGS_PER_MONTH = 6;

const handler: CustomHandler<"changelogs/get"> = async (prisma, params) => {
  if (!params.isAuthenticated) {
    const conditions: Prisma.Sql[] = [];
    if (params.gameId) {
      conditions.push(Prisma.sql`c."gameId" = ${params.gameId}`);
    }
    if (params.name) {
      conditions.push(Prisma.sql`g.name ILIKE ${"%" + params.name + "%"}`);
    }
    if (params.from) {
      conditions.push(
        Prisma.sql`c."createdAt" >= ${new Date(params.from as unknown as string)}`,
      );
    }
    if (params.to) {
      conditions.push(
        Prisma.sql`c."createdAt" <= ${new Date(params.to as unknown as string)}`,
      );
    }

    const where =
      conditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
        : Prisma.empty;

    const skip = params.skip ?? 0;
    const take = params.take ?? MONTHS_PER_PAGE;

    // Step A: distinct UTC month groups, newest first
    const monthRows = await prisma.$queryRaw<Array<{ month_start: Date }>>`
      SELECT DISTINCT DATE_TRUNC('month', c."createdAt") AS month_start
      FROM "Changelog" c
      JOIN "Game" g ON c."gameId" = g.id
      ${where}
      ORDER BY month_start DESC
      OFFSET ${skip}
      LIMIT ${take}
    `;

    // Step B: top CHANGELOGS_PER_MONTH per month, ordered by hours played
    const results = await Promise.all(
      monthRows.map((row) => {
        const start = row.month_start;
        const end = new Date(
          Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1),
        );
        return prisma.changelog.findMany({
          where: {
            gameId: params.gameId || undefined,
            game: params.name
              ? { name: { contains: params.name, mode: "insensitive" } }
              : undefined,
            createdAt: { gte: start, lt: end },
          },
          select: selectChangelog,
          take: CHANGELOGS_PER_MONTH,
          orderBy: { hours: "desc" },
        });
      }),
    );

    return results.flat();
  }

  const changelogs = await prisma.changelog.findMany({
    where: {
      gameId: params.gameId || undefined,
      game: params.name
        ? {
            name: {
              contains: params.name,
              mode: "insensitive",
            },
          }
        : undefined,
      createdAt: {
        gte: params.from,
        lte: params.to,
      },
    },
    select: selectChangelog,
    skip: params.skip,
    take: params.take || 24,
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "asc",
      },
    ],
  });
  return changelogs;
};

export default {
  path: "get",
  handler: handler,
  needsAuth: false,
};
