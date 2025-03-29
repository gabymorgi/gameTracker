import { format, startOfMonth } from 'date-fns'
import { NotificationLogger } from '@/utils/notification'
import { query } from '@/hooks/useFetch'
import { GameWithChangelogs } from '@/ts/api/games'
import { Changelog } from '@/ts/api/changelogs'

export function getImgUrl(appid: number): string {
  return `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`
}

async function getSteamAchievements(appid: number): Promise<{
  obtained: number
  total: number
}> {
  const steamAchievement = await query('steam/playerAchievements', {
    appid: appid,
  })
  return {
    obtained: (steamAchievement || []).filter((a) => a.achieved).length,
    total: steamAchievement?.length || 0,
  }
}

export async function getRecentlyPlayed(bannedGames: number[]): Promise<{
  originalGames: GameWithChangelogs[]
  updatedGames: GameWithChangelogs[]
}> {
  let steamGames = await query('steam/recentlyPlayed', undefined)

  const notificationLogger = new NotificationLogger(
    'games-parser',
    'parsing games',
    steamGames.length,
  )

  steamGames = steamGames.filter((steamGame) => {
    if (bannedGames.includes(steamGame.appid)) {
      notificationLogger.success(`${steamGame.name} is BANNED`)
      return false
    } else {
      return true
    }
  })

  const appids = steamGames
    .filter((steamGame) => steamGame.appid)
    .map((steamGame) => steamGame.appid)
  const localGames = await query('steam/game', {
    appids,
  })

  const originalGames: GameWithChangelogs[] = []
  const updatedGames: GameWithChangelogs[] = []
  for (const steamGame of steamGames) {
    const localGame = localGames.find(
      (localGame) => localGame.appid === steamGame.appid,
    )

    if (localGame) {
      if (steamGame.playtime_forever !== localGame.playedTime) {
        notificationLogger.success(
          `Updating ${steamGame.name}: +${
            steamGame.playtime_forever - localGame.playedTime
          }`,
        )
        const achievements = await getSteamAchievements(steamGame.appid)
        localGame.changelogs?.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
        )
        originalGames.push(structuredClone(localGame))
        const diffHours =
          (steamGame.playtime_forever || 0) - localGame.playedTime
        const diffAchievements =
          achievements.obtained - localGame.achievements.obtained
        localGame.playedTime = steamGame.playtime_forever
        localGame.achievements = achievements
        localGame.end = new Date()
        if (localGame.state === 'DROPPED') {
          localGame.state = 'PLAYING'
        }
        const actDate = format(new Date(), 'yyyy-MM')
        const existingChangelog = localGame.changelogs?.find(
          (c) => format(c.createdAt, 'yyyy-MM') === actDate,
        )
        if (existingChangelog) {
          existingChangelog.hours += diffHours
          existingChangelog.achievements += diffAchievements
        } else {
          if (localGame.changelogs) {
            const cl: Changelog = {
              createdAt: startOfMonth(new Date()),
              hours: diffHours,
              state:
                localGame.changelogs[localGame.changelogs.length - 1].state,
              achievements: diffAchievements,
            } as Changelog
            localGame.changelogs.push(cl)
          }
        }
        updatedGames.push(localGame)
      } else {
        notificationLogger.success(`Skipping ${steamGame.name}`)
      }
    } else {
      notificationLogger.success(`Adding ${steamGame.name}`)
      const achievements = await getSteamAchievements(steamGame.appid)
      const cl: Changelog = {
        createdAt: startOfMonth(new Date()),
        hours: steamGame.playtime_forever,
        state: 'PLAYING',
        achievements: achievements.obtained,
      } as Changelog
      const newGame: Partial<GameWithChangelogs> = {
        start: new Date(),
        end: new Date(),
        state: 'PLAYING',
        platform: 'PC',
        achievements,
        mark: -1,
        imageUrl: getImgUrl(steamGame.appid),
        playedTime: steamGame.playtime_forever,
        ...steamGame,
        changelogs: [cl],
      }
      updatedGames.push(newGame as GameWithChangelogs)
    }
  }
  return {
    originalGames,
    updatedGames,
  }
}
