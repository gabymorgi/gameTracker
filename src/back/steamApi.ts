import { endOfDay, startOfDay } from 'date-fns'
import { dateToNumber } from '@/utils/format'
import { FormGameI, GameI } from '@/ts/index'
import { NotificationInstance } from 'antd/es/notification/interface'
import { NotificationLogger } from '@/utils/notification'
import { Options, query } from '@/hooks/useFetch'

//https://developer.valvesoftware.com/wiki/Steam_Web_API#GetUserStatsForGame_.28v0002.29

interface steamRecentlyPlayedI {
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
  return `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?${searchParams.toString()}`
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

export async function parseRecentlyPlayedJSON(
  jsonData: string,
  notification: NotificationInstance
): Promise<Partial<FormGameI>[]> {
  const recentlyPlayed = JSON.parse(jsonData) as steamRecentlyPlayedI
  const notificationLogger = new NotificationLogger(
    notification,
    'games-parser',
    'parsing games',
    'info',
    recentlyPlayed.response.games.length
  )
  const existingGames = await query<GameI[]>('games', Options.GET, {
    appids: recentlyPlayed.response.games.map((game) => game.appid),
  })
  const preEditGames: Partial<FormGameI>[] = []
  for (const game of recentlyPlayed.response.games) {
    const existingData = existingGames.find(
      (existingGame) => existingGame.appid === game.appid
    )
    if (existingData) {
      if (game.playtime_forever !== existingData.playedTime) {
        notificationLogger.success({
          type: 'success',
          title: `Updating ${game.name}`,
        })
        preEditGames.push({
          ...existingData,
          state: existingData.stateId,
          tags: existingData.gameTags.map((tag) => tag.tagId),
          achievements: [existingData.obtainedAchievements, existingData.totalAchievements],
          oldHours: existingData.playedTime,
          playedTime: game.playtime_forever,
        })
      } else {
        notificationLogger.success({
          type: 'warning',
          title: `Skipping ${game.name}`,
        })
      }
    } else {
      notificationLogger.success({
        type: 'success',
        title: `Adding ${game.name}`,
      })
      preEditGames.push({
        playedTime: game.playtime_forever,
        appid: game.appid,
        name: game.name,
        start: dateToNumber(startOfDay(new Date())),
        end: dateToNumber(endOfDay(new Date())),
        imageUrl: getImgUrl(game.appid),
        state: 'Playing',
      })
    }
  }
  return preEditGames
}
