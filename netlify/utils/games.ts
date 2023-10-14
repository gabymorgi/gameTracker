import { PrismaClient } from "@prisma/client";
import { ExtraScoreI, GameI, TransactionalPrismaClient } from "../types";
import { endOfMonth, startOfMonth } from "date-fns";
import { dateToNumber } from '@/utils/format'

export async function upsertGame(
  prismaClient: PrismaClient | TransactionalPrismaClient,
  game: GameI,
  createChangelog: boolean
) {
  const prevData =
    game.id
      ? await prismaClient.game.findUnique({
          where: { id: game.id },
          select: {
            obtainedAchievements: true,
            stateId: true,
            playedTime: true,
            extraPlayedTime: true,
            gameTags: {
              select: {
                tagId: true,
              },
            },
            score: {
              select: {
                extras: {
                  select: {
                    id: true,
                    bias: true,
                    info: true,
                  },
                },
              },
            },
          },
        })
      : undefined;

  const prevExtras = prevData?.score?.extras;
  const extrasToAdd = game.score?.extra?.filter(
    (extra) => !prevExtras?.some(
      (prevExtra) => prevExtra.bias === Number(extra.bias) && prevExtra.info === extra.info
    )
  );
  const extrasToDelete = prevExtras?.filter(
    (prevExtra) => !game.score?.extra?.some(
      (extra) => prevExtra.bias === Number(extra.bias) && prevExtra.info === extra.info
    )
  );

  if (extrasToDelete?.length) {
    await prismaClient.scoreExtras.deleteMany({
      where: {
        id: {
          in: extrasToDelete.map((extra) => extra.id) || [],
        },
      },
    });
  }

  const prevTags = prevData?.gameTags;
  const tagsToAdd = game.tags.filter(
    (tag) => !prevTags?.some((prevTag) => prevTag.tagId === tag)
  );

  const tagsToDelete = prevTags?.filter(
    (prevTag) => !game.tags.some((tag) => prevTag.tagId === tag)
  );

  if (tagsToDelete?.length) {
    await prismaClient.gameTag.deleteMany({
      where: {
        tagId: {
          in: tagsToDelete.map((tag) => tag.tagId) || [],
        },
        gameId: game.id,
      },
    });
  }

  const updatedGame = await prismaClient.game.upsert({
    where: { id: game.id || "" },
    update: {
      name: game.name,
      appid: game.appid ? Number(game.appid) : undefined,
      start: Number(game.start),
      end: Number(game.end),
      imageUrl:
        game.imageUrl ||
        "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/spanish/Header_1.jpg",
      playedTime: Number(game.playedTime || 0),
      extraPlayedTime: Number(game.extraPlayedTime || 0),
      obtainedAchievements: Number(game.achievements?.[0] || 0),
      totalAchievements: Number(game.achievements?.[1] || 0),
      state: {
        connectOrCreate: {
          where: { id: game.state },
          create: {
            id: game.state,
            hue: 330,
          },
        },
      },
      score: game.score
        ? {
            update: {
              finalMark: Number(game.score.finalMark),
              bosses: Number(game.score.bosses),
              content: Number(game.score.content),
              controls: Number(game.score.controls),
              graphics: Number(game.score.graphics),
              music: Number(game.score.music),
              lore: Number(game.score.lore),
              mechanics: Number(game.score.mechanics),
              extras: extrasToAdd?.length ? {
                create: extrasToAdd?.map((extra: ExtraScoreI) => ({
                  bias: Number(extra.bias),
                  info: extra.info,
                })),
              } : undefined,
            },
          }
        : undefined,
      gameTags: tagsToAdd.length ? {
        create: tagsToAdd.map((tag) => ({
          tag: {
            connectOrCreate: {
              where: { id: tag },
              create: {
                hue: 330,
                id: tag,
              },
            },
          },
        })),
      } : undefined,
    },
    create: {
      name: game.name,
      appid: Number(game.appid),
      start: Number(game.start),
      end: Number(game.end),
      imageUrl:
        game.imageUrl ||
        "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/spanish/Header_1.jpg",
      playedTime: Number(game.playedTime || 0),
      extraPlayedTime: Number(game.extraPlayedTime || 0),
      obtainedAchievements: Number(game.achievements?.[0] || 0),
      totalAchievements: Number(game.achievements?.[1] || 0),
      state: {
        connectOrCreate: {
          where: { id: game.state },
          create: {
            id: game.state,
            hue: 330,
          },
        },
      },
      score: game.score
        ? {
            create: {
              finalMark: Number(game.score.finalMark),
              bosses: Number(game.score.bosses),
              content: Number(game.score.content),
              controls: Number(game.score.controls),
              graphics: Number(game.score.graphics),
              music: Number(game.score.music),
              lore: Number(game.score.lore),
              mechanics: Number(game.score.mechanics),
              extras: game.score.extra
                ? {
                    create: game.score.extra.map((extra: ExtraScoreI) => ({
                      bias: Number(extra.bias),
                      info: extra.info,
                    })),
                  }
                : undefined,
            },
          }
        : undefined,
      gameTags: {
        create: game.tags.map((tag) => ({
          tag: {
            connectOrCreate: {
              where: { id: tag },
              create: {
                hue: 330,
                id: tag,
              },
            },
          },
        })),
      },
    },
  });

  if (
    createChangelog && prevData &&
    (prevData.stateId !== updatedGame.stateId ||
      prevData.playedTime !== updatedGame.playedTime ||
      prevData.extraPlayedTime !== updatedGame.extraPlayedTime ||
      prevData.obtainedAchievements !== updatedGame.obtainedAchievements)
  ) {
    // check if there is a changelog for this game in the same month
    const startMonth = dateToNumber(startOfMonth(updatedGame.end));
    const endMonth = dateToNumber(endOfMonth(updatedGame.end));
    const existingChangelog = await prismaClient.changeLog.findFirst({
      where: {
        game: {
          id: updatedGame.id,
        },
        createdAt: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    });
    const data = {
      createdAt: Number(updatedGame.end),
      achievements:
        updatedGame.obtainedAchievements -
        (prevData.obtainedAchievements || 0),
      hours:
        updatedGame.playedTime -
        (prevData.playedTime || 0) +
        (updatedGame.extraPlayedTime || 0) -
        (prevData.extraPlayedTime || 0),
      state: {
        connect: {
          id: updatedGame.stateId,
        },
      },
    }
    await prismaClient.changeLog.upsert({
      where: {
        id: existingChangelog?.id || "",
      },
      update: data,
      create: {
        ...data,
        game: {
          connect: {
            id: updatedGame.id,
          },
        },
      },
    });
  }

  return updatedGame;
}
