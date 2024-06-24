/*
  Warnings:

  - Changed the type of `createdAt` on the `ChangeLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `start` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ChangeLog"
ALTER COLUMN "createdAt" TYPE TIMESTAMP(3) USING to_timestamp("createdAt");

-- AlterTable
ALTER TABLE "Game"
ALTER COLUMN "start" TYPE TIMESTAMP(3) USING to_timestamp("start"),
ALTER COLUMN "end" TYPE TIMESTAMP(3) USING to_timestamp("end");
