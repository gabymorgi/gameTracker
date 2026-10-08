-- AlterTable
ALTER TABLE "Changelog" RENAME COLUMN "hours" TO "playedTime";

ALTER TABLE "Book" RENAME COLUMN "words" TO "pages";
ALTER TABLE "BookChangelog" RENAME COLUMN "words" TO "pages";

UPDATE "BookChangelog"
SET "pages" = ROUND("pages"::numeric / 275)::integer;

UPDATE "Book"
SET "pages" = ROUND("pages"::numeric / 275)::integer;
