-- CreateTable
CREATE TABLE "ScoreExtras" (
    "id" TEXT NOT NULL,
    "bias" INTEGER NOT NULL,
    "info" TEXT NOT NULL,
    "scoreId" TEXT NOT NULL,

    CONSTRAINT "ScoreExtras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "controls" INTEGER,
    "music" INTEGER,
    "lore" INTEGER,
    "bosses" INTEGER,
    "mechanics" INTEGER,
    "graphics" INTEGER,
    "content" INTEGER,
    "finalMark" INTEGER NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "playedTime" INTEGER NOT NULL,
    "extraPlayedTime" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "appid" INTEGER,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "obtainedAchievements" INTEGER NOT NULL,
    "totalAchievements" INTEGER NOT NULL,
    "scoreId" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameTag" (
    "gameId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "GameTag_pkey" PRIMARY KEY ("gameId","tagId")
);

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL,
    "hue" INTEGER NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "hue" INTEGER NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeLog" (
    "id" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "hours" INTEGER NOT NULL,
    "achievements" INTEGER NOT NULL,
    "stateId" TEXT NOT NULL,

    CONSTRAINT "ChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_appid_key" ON "Game"("appid");

-- CreateIndex
CREATE UNIQUE INDEX "Game_scoreId_key" ON "Game"("scoreId");

-- AddForeignKey
ALTER TABLE "ScoreExtras" ADD CONSTRAINT "ScoreExtras_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "Score"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "Score"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameTag" ADD CONSTRAINT "GameTag_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameTag" ADD CONSTRAINT "GameTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeLog" ADD CONSTRAINT "ChangeLog_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
