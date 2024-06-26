import { endOfDay, format, startOfDay, startOfMonth } from 'date-fns'
import { ChangelogI, GameI } from '@/ts/game'
import { NotificationInstance } from 'antd/es/notification/interface'
import { NotificationLogger } from '@/utils/notification'
import { query } from '@/hooks/useFetch'
import { apiToGame } from '@/utils/format'

//https://developer.valvesoftware.com/wiki/Steam_Web_API#GetUserStatsForGame_.28v0002.29

export interface steamRecentlyPlayedI {
  response: {
    total_count: number
    games: {
      appid: number
      name: string
      playtime_2weeks: number
      playtime_forever: number
      img_icon_url: string
      playtime_windows_forever: number
      playtime_mac_forever: number
      playtime_linux_forever: number
    }[]
  }
}

export function getRecentlyPlayedGamesUrl(): string {
  const searchParams = new URLSearchParams()
  searchParams.set('key', import.meta.env.VITE_STEAM_API_KEY as string)
  searchParams.set('steamid', import.meta.env.VITE_STEAM_USER_ID as string)
  searchParams.set('include_appinfo', 'true')
  searchParams.set('include_played_free_games', 'true')
  searchParams.set('format', 'json')
  const http = import.meta.env.VITE_HTTPS === 'true' ? 'https' : 'http'
  return `${http}://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?${searchParams.toString()}`
}

export interface steamApiGameAchievementsI {
  playerstats: {
    steamID: string
    gameName: string
    achievements: {
      apiname: string
      achieved: number
      unlocktime: number
      name: string
      description: string
    }[]
    success: boolean
  }
}

export function getGameAchievementsUrl(appid: number): string {
  const searchParams = new URLSearchParams()
  searchParams.set('key', import.meta.env.VITE_STEAM_API_KEY as string)
  searchParams.set('steamid', import.meta.env.VITE_STEAM_USER_ID as string)
  searchParams.set('appid', appid.toString())
  searchParams.set('l', 'spanish')
  searchParams.set('format', 'json')
  return `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?${searchParams.toString()}`
}

export function getImgUrl(appid: number): string {
  return `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`
}

export interface SteamGame {
  name: string
  appid: number
  playedTime: number
  imageUrl: string
}

export async function parseRecentlyPlayedJSON(
  steamGames: Array<SteamGame>,
  notification: NotificationInstance,
): Promise<{
  originalGames: GameI[]
  updatedGames: GameI[]
}> {
  const notificationLogger = new NotificationLogger(
    notification,
    'games-parser',
    'parsing games',
    'info',
    steamGames.length,
  )
  const existingGames = (
    await query('games/get', {
      appids: steamGames
        .filter((steamGame) => steamGame.appid)
        .map((steamGame) => steamGame.appid),
      includeChangeLogs: 'true',
    })
  ).map((g) => apiToGame(g))
  const originalGames: GameI[] = []
  const updatedGames: GameI[] = []
  for (const steamGame of steamGames) {
    const existingGame = existingGames.find(
      (existingGame) => existingGame.appid === steamGame.appid,
    )

    if (existingGame) {
      if (steamGame.playedTime !== existingGame.playedTime) {
        notificationLogger.success({
          type: 'success',
          title: `Updating ${steamGame.name}: +${
            steamGame.playedTime - existingGame.playedTime
          }`,
        })
        existingGame.changeLogs?.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
        )
        originalGames.push(structuredClone(existingGame))
        const diffHours = (steamGame.playedTime || 0) - existingGame.playedTime
        existingGame.playedTime = steamGame.playedTime
        existingGame.end = endOfDay(new Date())
        const actDate = format(new Date(), 'yyyy-MM')
        const existingChangeLog = existingGame.changeLogs?.find(
          (c) => format(c.createdAt, 'yyyy-MM') === actDate,
        )
        if (existingChangeLog) {
          existingChangeLog.hours += diffHours
        } else {
          if (existingGame.changeLogs) {
            const cl: Omit<ChangelogI, 'game' | 'gameId' | 'id'> = {
              createdAt: startOfMonth(new Date()),
              hours: diffHours,
              stateId:
                existingGame.changeLogs[existingGame.changeLogs.length - 1]
                  .stateId,
              achievements: 0,
            }
            existingGame.changeLogs.push(cl as ChangelogI)
          }
        }
        updatedGames.push(existingGame)
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
        hours: steamGame.playedTime,
        stateId: 'Playing',
        achievements: 0,
      }
      const newGame = {
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        stateId: 'Playing',
        platform: 'PC',
        ...steamGame,
        changeLogs: [cl as ChangelogI],
      }
      updatedGames.push(newGame as unknown as GameI)
    }
  }
  return {
    originalGames,
    updatedGames,
  }
}
