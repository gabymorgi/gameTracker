/*
  Warnings:

  - You are about to drop the column `aciertos` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `errores` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `fechaUltima` on the `Word` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Phrase" ADD COLUMN     "translation" TEXT;

-- AlterTable
ALTER TABLE "Word" DROP COLUMN "aciertos",
DROP COLUMN "errores",
DROP COLUMN "fechaUltima",
ADD COLUMN     "fails" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "lastDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "success" DOUBLE PRECISION NOT NULL DEFAULT 0;
