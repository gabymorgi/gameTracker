/*
  Warnings:

  - Added the required column `gameId` to the `ChangeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChangeLog" ADD COLUMN     "gameId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ChangeLog" ADD CONSTRAINT "ChangeLog_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
