/*
  Warnings:

  - You are about to drop the `ChangeLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WordPhrase` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `wordId` to the `Phrase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WordPhrase" DROP CONSTRAINT "WordPhrase_phraseId_fkey";

-- DropForeignKey
ALTER TABLE "WordPhrase" DROP CONSTRAINT "WordPhrase_wordId_fkey";

ALTER TABLE "Phrase" ADD COLUMN "wordId" TEXT;

UPDATE "Phrase"
SET "wordId" = wp."wordId"
FROM "WordPhrase" wp
WHERE wp."phraseId" = "Phrase"."id";

-- Paso 3: Asegurarse de que la columna wordId no tenga valores nulos
UPDATE "Phrase"
SET "wordId" = 'NULL' -- o el valor que consideres correcto
WHERE "wordId" IS NULL;

ALTER TABLE "Phrase" ALTER COLUMN "wordId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Phrase" ADD CONSTRAINT "Phrase_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;



-- Changelog stuff

-- DropTable
DROP TABLE "WordPhrase";

-- RenameTable
ALTER TABLE "ChangeLog" RENAME TO "Changelog";

-- Eliminar la clave primaria antigua (si está en mayúsculas)
ALTER TABLE "Changelog" DROP CONSTRAINT "ChangeLog_pkey";

-- Crear la nueva clave primaria con el nombre actualizado
ALTER TABLE "Changelog" ADD CONSTRAINT "Changelog_pkey" PRIMARY KEY ("id");

-- Eliminar la clave foránea antigua
ALTER TABLE "Changelog" DROP CONSTRAINT "ChangeLog_gameId_fkey";

-- Crear la nueva clave foránea con el nombre actualizado
ALTER TABLE "Changelog" ADD CONSTRAINT "Changelog_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

