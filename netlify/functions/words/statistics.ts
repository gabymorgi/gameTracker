import { CustomHandler } from "../../types";

interface InProgress {
  priority: number;
  progressRange: number;
  amount: number;
}

const handler: CustomHandler = async (prisma) => {
  const learnt = await prisma.$queryRaw`
    SELECT TO_CHAR("nextPractice", 'YYYY-MM') as "date", COUNT(*) as "amount"
    FROM "Word"
    WHERE priority = -1
    GROUP BY "date"
    ORDER BY "date";
  `;

  const rawInProgress: InProgress[] = await prisma.$queryRaw`
    SELECT priority,
      CASE
        WHEN total_progress <= 2 THEN 0
        WHEN total_progress <= 3.25 THEN 1
        WHEN total_progress <= 4.25 THEN 2
        ELSE 3
      END as "progressRange",
      COUNT(*) as "amount"
    FROM (
      SELECT priority,
        ("practiceWord" + "practicePhrase" + "practicePronunciation" + "practiceListening" + "practiceTranslation") as total_progress
      FROM "Word"
      WHERE priority <> -1
        AND ("practiceWord" <> 0 OR "practicePhrase" <> 0 OR "practicePronunciation" <> 0 OR "practiceListening" <> 0 OR "practiceTranslation" <> 0)
    ) sub
    GROUP BY priority, "progressRange"
    ORDER BY priority, "progressRange";
  `;

  const inProgress: Record<number, number[]> = {};
  rawInProgress.forEach((row) => {
    if (!inProgress[row.priority]) {
      inProgress[row.priority] = [0, 0, 0, 0];
    }
    inProgress[row.priority][row.progressRange] = row.amount;
  });

  return { learnt, inProgress };
};

export default {
  path: "statistics",
  handler: handler,
  needsAuth: true,
};
