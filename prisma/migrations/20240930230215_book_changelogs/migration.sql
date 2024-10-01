-- CreateTable
CREATE TABLE "BookChangelog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "words" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "BookChangelog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookChangelog" ADD CONSTRAINT "BookChangelog_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
