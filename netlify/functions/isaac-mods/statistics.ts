import { CustomHandler } from "../../types";

const statisticsHandler: CustomHandler<"isaac-mods/statistics"> = async (
  prisma,
) => {
  const result: [{ total: number; played: number }] = await prisma.$queryRaw`
    SELECT
      COUNT(*) AS total,
      COUNT("playedAt") AS played
    FROM "IsaacMod"
  `;

  const total = result[0].total;
  const played = result[0].played;

  return {
    total,
    played,
  };
};

export default {
  path: "statistics",
  handler: statisticsHandler,
  needsAuth: false,
};
