-- CreateEnum
CREATE TYPE "FactorioModType" AS ENUM ('PLANET', 'OVERHAUL', 'CONTENT', 'MOD_PACK');

-- CreateEnum
CREATE TYPE "FactorioRequirement" AS ENUM ('VANILLA', 'NEW_SAVE', 'SPACE', 'VULCANUS', 'FULGORA', 'GLEBA', 'AQUILO');

-- CreateTable
CREATE TABLE "FactorioMod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "description" TEXT,
    "review" TEXT,
    "mark" INTEGER NOT NULL DEFAULT -1,
    "type" "FactorioModType" NOT NULL,
    "playedAt" TIMESTAMP(3),
    "requirements" "FactorioRequirement" NOT NULL,

    CONSTRAINT "FactorioMod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FactorioModDependencies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FactorioModDependencies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FactorioModDependencies_B_index" ON "_FactorioModDependencies"("B");

-- AddForeignKey
ALTER TABLE "_FactorioModDependencies" ADD CONSTRAINT "_FactorioModDependencies_A_fkey" FOREIGN KEY ("A") REFERENCES "FactorioMod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactorioModDependencies" ADD CONSTRAINT "_FactorioModDependencies_B_fkey" FOREIGN KEY ("B") REFERENCES "FactorioMod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
