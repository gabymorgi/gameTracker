import OpenAI from 'openai'
import { ScoreI } from './game'

export interface ApiChangelogsGameI {
  id: string
  name: string
  playedTime: number
  extraPlayedTime?: number
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
  score?: ScoreI
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

export interface ApiOpenAICreate {
  threadId: string
}

export interface ApiOpenAIGet {
  completed: boolean
  runId?: string
  messages: OpenAI.Beta.Threads.Messages.Message[]
}

export interface ApiOpenAISend {
  runId: string
}

export interface ApiPhrasesGet {
  id: string
  content: string
  translation: string | null
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

export interface ApiLogin {
  token: string
}
