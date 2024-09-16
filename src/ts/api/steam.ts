export interface SteamGames {
  appid: number
  name: string
  playtime_2weeks: number
  playtime_forever: number
  img_icon_url: string
  playtime_windows_forever: number
  playtime_mac_forever: number
  playtime_linux_forever: number
}

export interface SteamAchievementsParams {
  appid: number
}

export interface SteamAchievements {
  apiname: string
  achieved: number
  unlocktime: number
  name: string
  description: string
}

export interface SteamGameGetParams {
  appids: number[]
}
