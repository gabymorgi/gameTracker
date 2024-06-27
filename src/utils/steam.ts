import { endOfDay, format, startOfDay, startOfMonth } from 'date-fns'
import { ChangelogI, GameI } from '@/ts/game'
import { NotificationLogger } from '@/utils/notification'
import { query } from '@/hooks/useFetch'
import { apiToGame } from '@/utils/format'

export function getImgUrl(appid: number): string {
  return `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`
}

export interface SteamGame {
  name: string
  appid: number
  playedTime: number
  imageUrl: string
}

export async function getRecentlyPlayed(bannedGames: number[]): Promise<{
  originalGames: GameI[]
  updatedGames: GameI[]
}> {
  const steamGames = await query('steam/recentlyPlayed')
  const notificationLogger = new NotificationLogger(
    'games-parser',
    'parsing games',
    'info',
    steamGames.length,
  )
  const appids = steamGames
    .filter((steamGame) => steamGame.appid)
    .map((steamGame) => steamGame.appid)
  const localGames = (
    await query('games/get', {
      appids,
      includeChangeLogs: 'true',
    })
  ).map((g) => apiToGame(g))

  steamGames.filter((steamGame) => {
    if (bannedGames.includes(steamGame.appid)) {
      notificationLogger.success({
        type: 'warning',
        title: `Skipping ${steamGame.name}`,
      })
      return false
    } else {
      return true
    }
  })

  const steamAchievements = await query('steam/playerAchievements', { appids })
  const originalGames: GameI[] = []
  const updatedGames: GameI[] = []
  for (const steamGame of steamGames) {
    const localGame = localGames.find(
      (localGame) => localGame.appid === steamGame.appid,
    )

    const achievements = {
      obtained: (steamAchievements[steamGame.appid] || []).filter(
        (a) => a.achieved,
      ).length,
      total: steamAchievements[steamGame.appid]?.length || 0,
    }

    if (localGame) {
      if (steamGame.playtime_forever !== localGame.playedTime) {
        notificationLogger.success({
          type: 'success',
          title: `Updating ${steamGame.name}: +${
            steamGame.playtime_forever - localGame.playedTime
          }`,
        })
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
        localGame.end = endOfDay(new Date())
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
              stateId:
                localGame.changeLogs[localGame.changeLogs.length - 1].stateId,
              achievements: diffAchievements,
            }
            localGame.changeLogs.push(cl as ChangelogI)
          }
        }
        updatedGames.push(localGame)
      } else {
        notificationLogger.success({
          type: 'warning',
          title: `Skipping ${steamGame.name}`,
        })
      }
    } else {
      notificationLogger.success({
        type: 'success',
        title: `Adding ${steamGame.name}`,
      })
      const cl: Omit<ChangelogI, 'game' | 'gameId' | 'id'> = {
        createdAt: startOfMonth(new Date()),
        hours: steamGame.playtime_forever,
        stateId: 'Playing',
        achievements: 0,
      }
      const newGame: Partial<GameI> = {
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        stateId: 'Playing',
        platform: 'PC',
        achievements,
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
