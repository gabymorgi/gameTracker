import { GameState, createPrismaClient } from "#prisma-client";
import conversion from "../utils/conversion.json";

const prisma = createPrismaClient();

type SteamRecentlyPlayedGame = {
  appid: number;
  name: string;
  playtime_forever: number;
};

type SteamAchievement = {
  achieved: number;
};

type SteamAppDetailsResponse = Record<
  string,
  {
    success: boolean;
    data?: {
      header_image?: string;
      genres?: Array<{
        id: string;
        description: string;
      }>;
    };
  }
>;

type SteamAchievementsInfo = {
  obtained: number;
  total: number;
};

async function getRecentlyPlayedGames(): Promise<SteamRecentlyPlayedGame[]> {
  const API_KEY = process.env.VITE_STEAM_API_KEY;
  const USER_ID = process.env.VITE_STEAM_USER_ID;
  const HTTPS = process.env.VITE_HTTPS === "true" ? "https" : "http";

  const searchParams = new URLSearchParams();
  searchParams.set("key", API_KEY as string);
  searchParams.set("steamid", USER_ID as string);
  searchParams.set("include_appinfo", "true");
  searchParams.set("include_played_free_games", "true");
  searchParams.set("format", "json");

  const url = `${HTTPS}://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?${searchParams.toString()}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.response.games || [];
}

async function getSteamAchievements(
  appid: number,
): Promise<SteamAchievementsInfo> {
  const API_KEY = process.env.VITE_STEAM_API_KEY;
  const USER_ID = process.env.VITE_STEAM_USER_ID;
  const HTTPS = process.env.VITE_HTTPS === "true" ? "https" : "http";

  const searchParams = new URLSearchParams();
  searchParams.set("key", API_KEY as string);
  searchParams.set("steamid", USER_ID as string);
  searchParams.set("l", "spanish");
  searchParams.set("format", "json");
  searchParams.set("appid", appid.toString());

  const url = `${HTTPS}://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?${searchParams.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  const achievements = (data?.playerstats?.achievements ||
    []) as SteamAchievement[];

  return {
    obtained: achievements.filter((achievement) => achievement.achieved).length,
    total: achievements.length,
  };
}

async function getSteamAppDetails(appid: number): Promise<{
  imageUrl: string;
  steamGenres: string[];
}> {
  const response = await fetch(
    `https://store.steampowered.com/api/appdetails?appids=${appid}&l=english`,
  );
  const data = (await response.json()) as SteamAppDetailsResponse;
  const details = data[String(appid)];

  return {
    imageUrl:
      details?.data?.header_image ||
      `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`,
    steamGenres: (details?.data?.genres || []).map(
      (genre) => genre.description,
    ),
  };
}

function mapSteamGenresToLocalTags(steamGenres: string[]): string[] {
  const localTags = new Set<string>();

  for (const genre of steamGenres) {
    const mappedTags = conversion[genre as keyof typeof conversion] || [];
    for (const tagId of mappedTags) {
      localTags.add(tagId);
    }
  }

  return [...localTags];
}

function resolveState(
  currentState: GameState | null,
  achievements: SteamAchievementsInfo,
): GameState {
  const hasAllAchievements =
    achievements.total > 0 && achievements.obtained === achievements.total;

  if (hasAllAchievements) {
    return "ACHIEVEMENTS";
  }

  if (currentState === "DROPPED") {
    return "PLAYING";
  }

  return currentState || "PLAYING";
}

const formatPlayedTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes % 60;
  return `${hours}:${minutesLeft.toString().padStart(2, "0")}`;
};

const handler = async () => {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const monthStart = new Date(
    Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), 1),
  );
  const nextMonthStart = new Date(
    Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth() + 1, 1),
  );
  const changelogMonthDate = new Date(
    Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), 1, 12),
  );

  const recentlyPlayedGames = await getRecentlyPlayedGames();

  if (recentlyPlayedGames.length === 0) {
    return Response.json({ updated: 0, created: 0, skipped: 0 });
  }

  const appids = recentlyPlayedGames.map((game) => game.appid);

  const existingGames = await prisma.game.findMany({
    where: {
      appid: {
        in: appids,
      },
    },
    select: {
      id: true,
      appid: true,
      state: true,
      playedTime: true,
      obtainedAchievements: true,
      changelogs: {
        where: {
          createdAt: {
            gte: monthStart,
            lt: nextMonthStart,
          },
        },
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const existingByAppid = new Map(
    existingGames
      .filter((game) => game.appid !== null)
      .map((game) => [game.appid as number, game]),
  );

  const gamesToProcess = recentlyPlayedGames
    .map((steamGame) => {
      const existingGame = existingByAppid.get(steamGame.appid);
      const playTimeDiff = existingGame
        ? steamGame.playtime_forever - existingGame.playedTime
        : steamGame.playtime_forever;

      return { steamGame, existingGame, playTimeDiff };
    })
    .filter(
      ({ existingGame, playTimeDiff }) =>
        existingGame?.state !== "BANNED" && playTimeDiff >= 15,
    );

  const totalPlayedTime = gamesToProcess.reduce(
    (sum, { playTimeDiff }) => sum + playTimeDiff,
    0,
  );

  // Steam calls and their DB writes are independent per game, so run them concurrently
  // to stay well within the scheduled function's execution time limit.
  const results = await Promise.all(
    gamesToProcess.map(async ({ steamGame, existingGame, playTimeDiff }) => {
      const achievements = await getSteamAchievements(steamGame.appid);
      const label = `${steamGame.name}: ${formatPlayedTime(playTimeDiff)}`;

      if (!existingGame) {
        const appDetails = await getSteamAppDetails(steamGame.appid);
        const mappedTags = mapSteamGenresToLocalTags(appDetails.steamGenres);
        const state = resolveState(null, achievements);

        await prisma.game.create({
          data: {
            appid: steamGame.appid,
            name: steamGame.name,
            start: yesterday,
            end: yesterday,
            playedTime: steamGame.playtime_forever,
            imageUrl: appDetails.imageUrl,
            obtainedAchievements: achievements.obtained,
            totalAchievements: achievements.total,
            state,
            platform: "PC",
            mark: -1,
            changelogs: {
              createMany: {
                data: [
                  {
                    createdAt: changelogMonthDate,
                    hours: steamGame.playtime_forever,
                    achievements: achievements.obtained,
                    state,
                  },
                ],
              },
            },
            gameTags:
              mappedTags.length > 0
                ? {
                    createMany: {
                      data: mappedTags.map((tagId) => ({ tagId })),
                    },
                  }
                : undefined,
          },
        });

        if (mappedTags.length === 0) {
          await prisma.notification.create({
            data: {
              message: `Add tags for ${steamGame.name}:\nNo tags mapped for Steam genres: ${appDetails.steamGenres.join(", ")}`,
            },
          });
        }

        return { type: "created" as const, label };
      }

      const achievementsDiff =
        achievements.obtained - existingGame.obtainedAchievements;
      const state = resolveState(existingGame.state, achievements);
      const monthChangelog = existingGame.changelogs[0];

      await prisma.$transaction(async (transaction) => {
        await transaction.game.update({
          where: {
            id: existingGame.id,
          },
          data: {
            playedTime: steamGame.playtime_forever,
            end: yesterday,
            state,
            obtainedAchievements: achievements.obtained,
            totalAchievements: achievements.total,
          },
        });

        if (monthChangelog) {
          await transaction.changelog.update({
            where: {
              id: monthChangelog.id,
            },
            data: {
              hours: monthChangelog.hours + playTimeDiff,
              achievements: monthChangelog.achievements + achievementsDiff,
              state,
            },
          });
        } else {
          await transaction.changelog.create({
            data: {
              gameId: existingGame.id,
              createdAt: changelogMonthDate,
              hours: playTimeDiff,
              achievements: achievementsDiff,
              state,
            },
          });
        }
      });

      return { type: "updated" as const, label };
    }),
  );

  const updated = results
    .filter((result) => result.type === "updated")
    .map((result) => result.label);
  const created = results
    .filter((result) => result.type === "created")
    .map((result) => result.label);

  await prisma.notification.create({
    data: {
      message: `Checked recently played games. ${formatPlayedTime(totalPlayedTime)}.\n\nUpdated:\n${updated
        .map((name) => `- ${name}`)
        .join("\n")}\n\nCreated:\n${created
        .map((name) => `- ${name}`)
        .join("\n")}`,
    },
  });
};

export default handler;

export const config = {
  schedule: "@daily",
};
