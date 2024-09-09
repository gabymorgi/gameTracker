/*
  Warnings:

  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GameState" AS ENUM ('ACHIEVEMENTS', 'BANNED', 'COMPLETED', 'DROPPED', 'PLAYING', 'WON');

-- DropForeignKey
ALTER TABLE "ChangeLog" DROP CONSTRAINT "ChangeLog_stateId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_stateId_fkey";

-- AlterTable
ALTER TABLE "ChangeLog" ADD COLUMN "state" "GameState";
ALTER TABLE "Game" ADD COLUMN "state" "GameState";

-- DropTable
DROP TABLE "State";
