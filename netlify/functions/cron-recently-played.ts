import { GameState, PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import conversion from "../utils/conversion.json";

const prisma = new PrismaClient();

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
    `https://store.steampowered.com/api/appdetails?appids=${appid}`,
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

const handler = async () => {
  const today = new Date();
  const changelogMonth = format(today, "yyyy-MM");

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
    include: {
      gameTags: true,
      changelogs: {
        take: 3,
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

  let updated: string[] = [];
  let created: string[] = [];
  let skipped: string[] = [];

  for (const steamGame of recentlyPlayedGames) {
    const existingGame = existingByAppid.get(steamGame.appid);

    if (existingGame?.state === "BANNED") {
      skipped.push(`${steamGame.name} (banned)`);
      continue;
    }

    const playTimeDiff = existingGame
      ? steamGame.playtime_forever - existingGame.playedTime
      : steamGame.playtime_forever;

    if (playTimeDiff < 15) {
      skipped.push(`${steamGame.name} (playtime diff: ${playTimeDiff} mins)`);
      continue;
    }

    const [achievements, appDetails] = await Promise.all([
      getSteamAchievements(steamGame.appid),
      getSteamAppDetails(steamGame.appid),
    ]);

    const mappedTags = mapSteamGenresToLocalTags(appDetails.steamGenres);

    if (!existingGame) {
      const state = resolveState(null, achievements);

      await prisma.game.create({
        data: {
          appid: steamGame.appid,
          name: steamGame.name,
          start: today,
          end: today,
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
                  createdAt: today,
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

      created.push(steamGame.name);
      if (mappedTags.length === 0) {
        await prisma.notification.create({
          data: {
            message: `Add tags for ${steamGame.name}:\nNo tags mapped for Steam genres: ${appDetails.steamGenres.join(", ")}`,
          },
        });
      }
      continue;
    }

    const achievementsDiff =
      achievements.obtained - existingGame.obtainedAchievements;
    const state = resolveState(existingGame.state, achievements);
    const monthChangelog = existingGame.changelogs.find(
      (changelog) => format(changelog.createdAt, "yyyy-MM") === changelogMonth,
    );

    await prisma.$transaction(async (transaction) => {
      await transaction.game.update({
        where: {
          id: existingGame.id,
        },
        data: {
          playedTime: steamGame.playtime_forever,
          end: today,
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
            createdAt: today,
            hours: playTimeDiff,
            achievements: achievementsDiff,
            state,
          },
        });
      }
    });

    updated.push(steamGame.name);
  }

  await prisma.notification.create({
    data: {
      message: `Checked recently played games. Updated ${updated.length} and created ${created.length}.\n\nUpdated:\n${updated
        .map((name) => `- ${name}`)
        .join("\n")}\n\nCreated:\n${created
        .map((name) => `- ${name}`)
        .join("\n")}\n\nSkipped:\n${skipped
        .map((name) => `- ${name}`)
        .join("\n")}`,
    },
  });
};

export default handler;

export const config = {
  schedule: "@daily",
};
