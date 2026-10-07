import { CustomHandler } from "../../types";

interface BookStatisticResponse {
  pages: Array<{
    amount: number;
    month_year: string;
  }>;
}

const handler: CustomHandler<"books/statistics"> = async (prisma, params) => {
  const pages: BookStatisticResponse["pages"] = await prisma.$queryRaw`
    SELECT 
      to_char("createdAt", 'YYYY-MM') AS month_year,
      SUM("pages") AS amount
    FROM "BookChangelog"
    WHERE "createdAt" BETWEEN
      ${new Date(params.from)} AND
      ${new Date(params.to)}
    GROUP BY month_year
    ORDER BY month_year;
  `;

  return {
    pages,
  };
};

export default {
  path: "statistics",
  handler: handler,
  needsAuth: false,
};
