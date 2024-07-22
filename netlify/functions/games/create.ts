import { Platform } from "@prisma/client";
import { CRUDArray, CustomHandler } from "../../types";

interface GameI {
  id: string;
  appid: number;
  name: string;
  start: string;
  tags: CRUDArray<string>;
  stateId: string;
  end: string;
  playedTime: number;
  extraPlayedTime: number;
  mark: number;
  review: string;
  imageUrl: string;
  achievements: {
    obtained: number;
    total: number;
  };
  platform: Platform;
  changeLogs?: CRUDArray<ChangeLogI>;
}

interface ChangeLogI {
  id: string;
  createdAt: Date;
  hours: number;
  achievements: number;
  stateId: string;
}

const createHandler: CustomHandler = async (prisma, game: GameI) => {
  const createdGame = await prisma.game.create({
    data: {
      appid: game.appid,
      name: game.name,
      start: game.start,
      end: game.end,
      playedTime: game.playedTime,
      extraPlayedTime: game.extraPlayedTime,
      mark: game.mark,
      review: game.review,
      stateId: game.stateId,
      obtainedAchievements: game.achievements?.obtained || 0,
      totalAchievements: game.achievements?.total || 0,
      imageUrl: game.imageUrl,
      platform: game.platform,
      gameTags: game.tags
        ? {
            createMany: {
              data: game.tags.create.map((tag) => ({ tagId: tag })),
            },
          }
        : undefined,
      changeLogs: game.changeLogs
        ? {
            createMany: {
              data: game.changeLogs.create.map((changelog) => ({
                createdAt: changelog.createdAt,
                hours: changelog.hours,
                achievements: changelog.achievements,
                stateId: changelog.stateId,
              })),
            },
          }
        : undefined,
    },
  });

  return createdGame;
};

export default {
  path: "create",
  handler: createHandler,
  needsAuth: true,
};
