import { format, startOfMonth } from 'date-fns'
import { ChangelogI, GameI } from '@/ts/game'
import { NotificationLogger } from '@/utils/notification'
import { query } from '@/hooks/useFetch'
import { apiToGame } from '@/utils/format'
import { GameState } from '@/ts/api'

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
  originalGames: GameI[]
  updatedGames: GameI[]
}> {
  let steamGames = await query('steam/recentlyPlayed')

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
  const localGames = (
    await query('games/get', {
      appids,
      includeChangeLogs: 'true',
    })
  ).map(apiToGame)

  const originalGames: GameI[] = []
  const updatedGames: GameI[] = []
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
            const cl: Omit<ChangelogI, 'game' | 'gameId' | 'id'> = {
              createdAt: startOfMonth(new Date()),
              hours: diffHours,
              state:
                localGame.changeLogs[localGame.changeLogs.length - 1].state,
              achievements: diffAchievements,
            }
            localGame.changeLogs.push(cl as ChangelogI)
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
      const cl: Omit<ChangelogI, 'game' | 'gameId' | 'id'> = {
        createdAt: startOfMonth(new Date()),
        hours: steamGame.playtime_forever,
        state: GameState.PLAYING,
        achievements: achievements.obtained,
      }
      const newGame: Partial<GameI> = {
        start: new Date(),
        end: new Date(),
        state: GameState.PLAYING,
        platform: 'PC',
        achievements,
        mark: -1,
        imageUrl: getImgUrl(steamGame.appid),
        playedTime: steamGame.playtime_forever,
        ...steamGame,
        changeLogs: [cl as ChangelogI],
      }
      updatedGames.push(newGame as GameI)
    }
  }
  return {
    originalGames,
    updatedGames,
  }
}
