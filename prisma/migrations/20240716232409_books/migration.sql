/*
  Warnings:

  - Made the column `mark` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BookState" AS ENUM ('WANT_TO_READ', 'READING', 'FINISHED', 'DROPPED');

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "mark" SET NOT NULL;

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "saga" TEXT NOT NULL,
    "words" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "language" TEXT NOT NULL,
    "state" "BookState" NOT NULL DEFAULT 'READING',
    "mark" INTEGER NOT NULL DEFAULT -1,
    "review" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);
