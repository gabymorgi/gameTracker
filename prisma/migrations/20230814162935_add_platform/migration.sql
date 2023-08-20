-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('NES', 'SEGA', 'PS1', 'PS2', 'SNES', 'PC', 'NDS', 'GBA', 'WII', 'ANDROID', 'FLASH');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "platform" "Platform" NOT NULL DEFAULT 'PC';
