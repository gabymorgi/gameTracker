/*
  Warnings:

  - You are about to drop the column `practiceTranslationPhrase` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `practiceTranslationWord` on the `Word` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Word" DROP COLUMN "practiceTranslationPhrase",
DROP COLUMN "practiceTranslationWord",
ADD COLUMN     "practiceTranslation" DOUBLE PRECISION NOT NULL DEFAULT 0;
