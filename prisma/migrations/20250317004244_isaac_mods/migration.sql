-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('CHARACTER', 'CHALLENGE');

-- CreateTable
CREATE TABLE "IsaacMod" (
    "id" TEXT NOT NULL,
    "appid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "wiki" TEXT,
    "items" INTEGER NOT NULL,
    "extra" TEXT,
    "playedAt" TIMESTAMP(3),
    "isQoL" BOOLEAN NOT NULL,
    "isEnemies" BOOLEAN NOT NULL,

    CONSTRAINT "IsaacMod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IsaacPlayableContent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "review" TEXT,
    "mark" INTEGER NOT NULL DEFAULT -1,
    "type" "ContentType" NOT NULL,
    "modId" TEXT NOT NULL,

    CONSTRAINT "IsaacPlayableContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IsaacPlayableContent" ADD CONSTRAINT "IsaacPlayableContent_modId_fkey" FOREIGN KEY ("modId") REFERENCES "IsaacMod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
