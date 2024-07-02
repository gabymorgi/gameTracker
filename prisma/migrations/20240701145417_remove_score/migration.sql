/*
  Warnings:

  - You are about to drop the column `scoreId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `Score` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScoreExtras` table. If the table is not empty, all the data it contains will be lost.

*/

ALTER TABLE "Game" ADD COLUMN "mark" INTEGER DEFAULT -1; -- Default a -1 como pediste
ALTER TABLE "Game" ADD COLUMN "review" TEXT DEFAULT NULL; -- Default a NULL

-- Migrate finalMark from Score to mark in Game
UPDATE "Game"
SET "mark" = COALESCE((SELECT "finalMark" FROM "Score" WHERE "Score"."id" = "Game"."scoreId"), -1);

-- Concatenate info from ScoreExtras and migrate to review in Game
UPDATE "Game"
SET "review" = (
  SELECT STRING_AGG("info", E'\n')
  FROM "ScoreExtras"
  INNER JOIN "Score" ON "ScoreExtras"."scoreId" = "Score"."id"
  WHERE "Score"."id" = "Game"."scoreId"
);

-- Delete FK and column
ALTER TABLE "Game" DROP COLUMN "scoreId";
DROP INDEX IF EXISTS "Game_scoreId_key";
ALTER TABLE "Game" DROP CONSTRAINT IF EXISTS "Game_scoreId_fkey";

-- Drop tables
DROP TABLE IF EXISTS "ScoreExtras" CASCADE;
DROP TABLE IF EXISTS "Score" CASCADE;
