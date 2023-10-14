-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_scoreId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "extraPlayedTime" DROP NOT NULL,
ALTER COLUMN "scoreId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "Score"("id") ON DELETE SET NULL ON UPDATE CASCADE;
