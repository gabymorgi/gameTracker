import { format, startOfMonth } from 'date-fns'
import { NotificationLogger } from '@/utils/notification'
import { query } from '@/hooks/useFetch'
import { gameState, GameWithChangelogs } from '@/ts/api/games'
import { Changelog } from '@/ts/api/changelogs'

export function getImgUrl(appid: number): string {
  return `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`
}

async function getSteamAchievements(appid: number): Promise<{
  obtained: number
  total: number
}> {
  const steamAchievement = await query('steam/playerAchievements', 'GET', {
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
  let steamGames = await query('steam/recentlyPlayed', 'GET', undefined)

  const notificationLogger = new NotificationLogger(
    'games-parser',
    'parsing games',
    'info',
    steamGames.length,
  )

  steamGames = steamGames.filter((steamGame) => {
    if (bannedGames.includes(steamGame.appid)) {
      notificationLogger.success({
        type: 'warning',
        title: `${steamGame.name} is BANNED`,
      })
      return false
    } else {
      return true
    }
  })

  const appids = steamGames
    .filter((steamGame) => steamGame.appid)
    .map((steamGame) => steamGame.appid)
  const localGames = await query('steam/game', 'GET', {
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
        notificationLogger.success({
          type: 'success',
          title: `Updating ${steamGame.name}: +${
            steamGame.playtime_forever - localGame.playedTime
          }`,
        })
        const achievements = await getSteamAchievements(steamGame.appid)
        localGame.changeLogs?.sort(
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
        const actDate = format(new Date(), 'yyyy-MM')
        const existingChangeLog = localGame.changeLogs?.find(
          (c) => format(c.createdAt, 'yyyy-MM') === actDate,
        )
        if (existingChangeLog) {
          existingChangeLog.hours += diffHours
          existingChangeLog.achievements += diffAchievements
        } else {
          if (localGame.changeLogs) {
            const cl: Changelog = {
              createdAt: startOfMonth(new Date()),
              hours: diffHours,
              state:
                localGame.changeLogs[localGame.changeLogs.length - 1].state,
              achievements: diffAchievements,
            } as Changelog
            localGame.changeLogs.push(cl)
          }
        }
        updatedGames.push(localGame)
      } else {
        notificationLogger.success({
          type: 'info',
          title: `Skipping ${steamGame.name}`,
        })
      }
    } else {
      notificationLogger.success({
        type: 'success',
        title: `Adding ${steamGame.name}`,
      })
      const achievements = await getSteamAchievements(steamGame.appid)
      const cl: Changelog = {
        createdAt: startOfMonth(new Date()),
        hours: steamGame.playtime_forever,
        state: gameState.PLAYING,
        achievements: achievements.obtained,
      } as Changelog
      const newGame: Partial<GameWithChangelogs> = {
        start: new Date(),
        end: new Date(),
        state: gameState.PLAYING,
        platform: 'PC',
        achievements,
        mark: -1,
        imageUrl: getImgUrl(steamGame.appid),
        playedTime: steamGame.playtime_forever,
        ...steamGame,
        changeLogs: [cl],
      }
      updatedGames.push(newGame as GameWithChangelogs)
    }
  }
  return {
    originalGames,
    updatedGames,
  }
}
