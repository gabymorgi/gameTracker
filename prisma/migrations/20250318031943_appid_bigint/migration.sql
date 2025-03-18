/*
  Warnings:

  - A unique constraint covering the columns `[appid]` on the table `IsaacMod` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IsaacMod" ALTER COLUMN "appid" SET DATA TYPE BIGINT,
ALTER COLUMN "items" SET DEFAULT 0,
ALTER COLUMN "isQoL" SET DEFAULT false,
ALTER COLUMN "isEnemies" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "IsaacMod_appid_key" ON "IsaacMod"("appid");
