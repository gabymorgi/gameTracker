-- Rename the existing table without dropping its data.
ALTER TABLE "Tags" RENAME TO "Tag";
ALTER TABLE "Tag" RENAME CONSTRAINT "Tags_pkey" TO "Tag_pkey";
