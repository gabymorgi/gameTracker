/*
  Warnings:

  - You are about to drop the column `practicePronuntation` on the `Word` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Word" DROP COLUMN "practicePronuntation",
ADD COLUMN     "practicePronunciation" DOUBLE PRECISION NOT NULL DEFAULT 0;
