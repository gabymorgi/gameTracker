export interface ApiBook {
  id: string
  name: string
  start: string
  state: string
  end: string
  words: number
  language: string
  saga: string
  mark: number
  review?: string
  imageUrl?: string
}

export interface ApiChangelogsGameI {
  id: string
  name: string
  playedTime: number
  extraPlayedTime?: number
  mark: number
  imageUrl: string
  obtainedAchievements: number
  totalAchievements: number
  changeLogs: Array<{
    id: string
    stateId: string
    createdAt: string
    hours: number
    achievements: number
    gameId: string
  }>
}

export interface ApiChangelog {
  id: string
  createdAt: string
  hours: number
  achievements: number
  stateId: string
  gameId: string
  game: {
    name: string
    imageUrl: string
  }
}

export interface ApiAggregateI {
  playedTime: Array<{
    hours: number
    achievements: number
    month_year: string
    sum: number
  }>
  states: Array<{
    stateId: string
    count: number
  }>
  tags: Array<{
    tagId: string
    total_hours: number
  }>
}

export interface ApiGame {
  id: string
  appid?: number
  name: string
  start: string
  stateId: string
  end: string
  playedTime: number
  extraPlayedTime?: number
  mark: number
  review?: string
  imageUrl?: string
  obtainedAchievements: number
  totalAchievements: number
  platform: string
  gameTags: Array<{
    gameId: string
    tagId: string
  }>
  changeLogs: Array<{
    id: string
    createdAt: string
    hours: number
    achievements: number
    stateId: string
    gameId: string
  }>
}

export interface ApiGameSearch {
  id: string
  name: string
  imageUrl: string
}

export type ApiSteamAchievementsI = {
  apiname: string
  achieved: number
  unlocktime: number
  name: string
  description: string
}

export interface ApiSteamRecentlyPlayedI {
  appid: number
  name: string
  playtime_2weeks: number
  playtime_forever: number
  img_icon_url: string
  playtime_windows_forever: number
  playtime_mac_forever: number
  playtime_linux_forever: number
}

export interface ApiGetGameTags {
  gameId: string
  tagId: string
}

export interface ApiGetGlobalTags {
  states: Array<{
    id: string
    hue: number
  }>
  tags: Array<{
    id: string
    hue: number
  }>
}

export interface ApiMemoGet {
  id: string
  value: string
  definition: string
  pronunciation: string
  priority: number
  nextPractice: string
  practiceListening: number
  practicePhrase: number
  practicePronunciation: number
  practiceTranslation: number
  practiceWord: number
  wordPhrases: Array<{
    phrase: {
      id: string
      content: string
      translation: string | null
    }
  }>
}

export type ApiMemoFind = ApiMemoGet

export interface ApiMemoSearch {
  id: string
  value: string
}

export interface ApiMemoStatistics {
  learnt: Array<{
    date: string
    amount: number
  }>
  inProgress: Record<number, number[]>
}

export interface ApiLogin {
  token: string
}
