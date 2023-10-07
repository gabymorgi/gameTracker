-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "definition" TEXT,
    "pronunciation" TEXT,
    "aciertos" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "errores" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fechaUltima" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phrase" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Phrase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPhrase" (
    "wordId" TEXT NOT NULL,
    "phraseId" TEXT NOT NULL,

    CONSTRAINT "WordPhrase_pkey" PRIMARY KEY ("wordId","phraseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_value_key" ON "Word"("value");

-- AddForeignKey
ALTER TABLE "WordPhrase" ADD CONSTRAINT "WordPhrase_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPhrase" ADD CONSTRAINT "WordPhrase_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "Phrase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
