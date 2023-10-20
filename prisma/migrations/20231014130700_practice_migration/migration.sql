ALTER TABLE "Word" RENAME COLUMN "lastDate" TO "nextPractice";

ALTER TABLE "Word" DROP COLUMN "success",
DROP COLUMN "fails",
ADD COLUMN "practiceWord" FLOAT DEFAULT 0,
ADD COLUMN "practicePhrase" FLOAT DEFAULT 0,
ADD COLUMN "practicePronuntation" FLOAT DEFAULT 0,
ADD COLUMN "practiceListening" FLOAT DEFAULT 0,
ADD COLUMN "practiceTranslationWord" FLOAT DEFAULT 0,
ADD COLUMN "practiceTranslationPhrase" FLOAT DEFAULT 0;
