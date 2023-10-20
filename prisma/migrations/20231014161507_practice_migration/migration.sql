/*
  Warnings:

  - Made the column `practiceWord` on table `Word` required. This step will fail if there are existing NULL values in that column.
  - Made the column `practicePhrase` on table `Word` required. This step will fail if there are existing NULL values in that column.
  - Made the column `practicePronuntation` on table `Word` required. This step will fail if there are existing NULL values in that column.
  - Made the column `practiceListening` on table `Word` required. This step will fail if there are existing NULL values in that column.
  - Made the column `practiceTranslationWord` on table `Word` required. This step will fail if there are existing NULL values in that column.
  - Made the column `practiceTranslationPhrase` on table `Word` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Word" ALTER COLUMN "practiceWord" SET NOT NULL,
ALTER COLUMN "practicePhrase" SET NOT NULL,
ALTER COLUMN "practicePronuntation" SET NOT NULL,
ALTER COLUMN "practiceListening" SET NOT NULL,
ALTER COLUMN "practiceTranslationWord" SET NOT NULL,
ALTER COLUMN "practiceTranslationPhrase" SET NOT NULL;
