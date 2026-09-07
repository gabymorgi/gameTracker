-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Backfill tags from the GameTag join table
UPDATE "Game" g
SET "tags" = sub.tags
FROM (
  SELECT "gameId", array_agg("tagId") AS tags
  FROM "GameTag"
  GROUP BY "gameId"
) sub
WHERE g.id = sub."gameId";

-- DropForeignKey
ALTER TABLE "GameTag" DROP CONSTRAINT "GameTag_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GameTag" DROP CONSTRAINT "GameTag_tagId_fkey";

-- DropTable
DROP TABLE "GameTag";
