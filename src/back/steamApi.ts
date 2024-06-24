import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns'
import { FormGameI, GameI } from '@/ts/index'
import { NotificationInstance } from 'antd/es/notification/interface'
import { NotificationLogger } from '@/utils/notification'
import { query } from '@/hooks/useFetch'
import { gameToForm } from '@/utils/gamesUtils'

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
  originalGames: FormGameI[]
  updatedGames: Partial<FormGameI>[]
}> {
  const notificationLogger = new NotificationLogger(
    notification,
    'games-parser',
    'parsing games',
    'info',
    steamGames.length,
  )
  const existingGames = await query<
    Array<
      GameI & {
        changeLogs: Array<{
          id: string
          achievements: number
          createdAt: string
          hours: number
        }>
      }
    >
  >('games/get', 'GET', {
    appids: steamGames
      .filter((steamGame) => steamGame.appid)
      .map((steamGame) => steamGame.appid),
    includeChangeLogs: 'true',
  })
  const originalGames: FormGameI[] = []
  const updatedGames: Partial<FormGameI>[] = []
  for (const steamGame of steamGames) {
    const existingData = existingGames.find(
      (existingGame) => existingGame.appid === steamGame.appid,
    )

    if (existingData) {
      if (steamGame.playedTime !== existingData.playedTime) {
        notificationLogger.success({
          type: 'success',
          title: `Updating ${steamGame.name}: +${
            steamGame.playedTime - existingData.playedTime
          }`,
        })
        const parsedGame = gameToForm(existingData)
        originalGames.push(structuredClone(parsedGame))
        parsedGame.playedTime = steamGame.playedTime
        const diffHours = (steamGame.playedTime || 0) - existingData.playedTime
        const existingChangeLog = parsedGame.changeLogs?.find(
          (c) =>
            c.createdAt > startOfMonth(new Date()) &&
            c.createdAt < endOfMonth(new Date()),
        )
        if (existingChangeLog) {
          existingChangeLog.hours += diffHours
        } else {
          parsedGame.changeLogs?.push({
            createdAt: startOfMonth(new Date()),
            hours: diffHours,
            stateId: 'Playing',
            achievements: 0,
          })
        }
        updatedGames.push(parsedGame)
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
      updatedGames.push({
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        stateId: 'Playing',
        platform: 'PC',
        ...steamGame,
        changeLogs: [
          {
            createdAt: startOfMonth(new Date()),
            hours: steamGame.playedTime,
            stateId: 'Playing',
            achievements: 0,
          },
        ],
      })
    }
  }
  return {
    originalGames,
    updatedGames,
  }
}
