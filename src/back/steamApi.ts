import { endOfDay, startOfDay } from 'date-fns'
import { dateToNumber } from '@/utils/format'
import { ExtendedGameI } from '@/ts/index'
import { NotificationInstance } from 'antd/es/notification/interface'
import { NotificationLogger } from '@/utils/notification'

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
  searchParams.set('key', import.meta.env.REACT_APP_STEAM_API_KEY as string)
  searchParams.set('steamid', import.meta.env.REACT_APP_STEAM_USER_ID as string)
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

export function getGameAchievementsUrl(appId: number): string {
  const searchParams = new URLSearchParams()
  searchParams.set('key', import.meta.env.REACT_APP_STEAM_API_KEY as string)
  searchParams.set('steamid', import.meta.env.REACT_APP_STEAM_USER_ID as string)
  searchParams.set('appid', appId.toString())
  searchParams.set('l', 'spanish')
  searchParams.set('format', 'json')
  return `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?${searchParams.toString()}`
}

export function getImgUrl(appId: number): string {
  return `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/header.jpg`
}

export async function parseRecentlyPlayedJSON(
  jsonData: string,
  notification: NotificationInstance
): Promise<Partial<ExtendedGameI>[]> {
  const recentlyPlayed = JSON.parse(jsonData) as steamRecentlyPlayedI
  const notificationLogger = new NotificationLogger(
    notification,
    'games-parser',
    'parsing games',
    'info',
    recentlyPlayed.response.games.length
  )
  // const collectionRef: CollectionReference<DocumentGameI> = collection(
  //   db,
  //   CollectionType.Games
  // ) as CollectionReference<DocumentGameI>
  const preEditGames: Partial<ExtendedGameI>[] = []
  for (const game of recentlyPlayed.response.games) {
    // const queryConstrains = [where('appid', '==', game.appid)]
    // const q = query(collectionRef, ...queryConstrains)
    const existingData: Partial<ExtendedGameI> | undefined = undefined
    try {
      // const querySnapshot = await getDocs(q)
      // existingData = querySnapshot.docs[0]
      //   ? {
      //       ...querySnapshot.docs[0].data(),
      //       oldHours: querySnapshot.docs[0].data().hours,
      //       hours: game.playtime_forever,
      //       id: querySnapshot.docs[0].id,
      //     }
      //   : undefined
    } catch (error: any) {
      console.error('Error getting documents: ', error)
    }
    if (existingData) {
      
      // if (game.playtime_forever !== existingData.oldHours) {
      //   notificationLogger.success({
      //     type: 'success',
      //     title: `Updating ${game.name}`,
      //   })
      //   preEditGames.push(existingData)
      // } else {
      //   notificationLogger.success({
      //     type: 'warning',
      //     title: `Skipping ${game.name}`,
      //   })
      // }
    } else {
      notificationLogger.success({
        type: 'success',
        title: `Adding ${game.name}`,
      })
      preEditGames.push({
        hours: game.playtime_forever,
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
