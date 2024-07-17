import {
  ApiBook,
  ApiChangelog,
  ApiChangelogsGameI,
  ApiGame,
  ApiMemoGet,
} from '@/ts/api'
import { BookI, Memo } from '@/ts/books'
import { ChangelogsGameI, GameI, ChangelogI } from '@/ts/game'
import { NamePath } from 'antd/es/form/interface'
import { parseISO } from 'date-fns'

export const formatPlayedTime = (minutes: number) => {
  if (!minutes) return 'no data'
  const hours = Math.sign(minutes) * Math.floor(Math.abs(minutes) / 60)
  const minutesLeft = (Math.abs(minutes) % 60) * Math.sign(minutes)
  return `${hours}:${minutesLeft.toString().padStart(2, '0')}`
}

export const formattedDate = (date: Date) => {
  // 2024 Jan
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

export const formattedPathName: (name?: NamePath) => Array<string | number> = (
  name,
) => {
  if (name === undefined) return []
  if (Array.isArray(name)) return name
  return [name]
}

export function apiToBook(book: ApiBook): BookI {
  return {
    id: book.id,
    name: book.name,
    start: parseISO(book.start),
    end: parseISO(book.end),
    state: book.state,
    words: book.words,
    language: book.language,
    mark: book.mark,
    review: book.review,
    imageUrl: book.imageUrl,
  }
}

export function apiToGame(game: ApiGame): GameI {
  return {
    id: game.id,
    appid: game.appid,
    name: game.name,
    start: parseISO(game.start),
    end: parseISO(game.end),
    stateId: game.stateId,
    playedTime: game.playedTime,
    extraPlayedTime: game.extraPlayedTime,
    mark: game.mark,
    review: game.review,
    imageUrl: game.imageUrl,
    platform: game.platform,
    tags: game.gameTags.map((t) => t.tagId),
    achievements: {
      obtained: game.obtainedAchievements,
      total: game.totalAchievements,
    },
    changeLogs: game.changeLogs?.map((c) => ({
      ...c,
      createdAt: parseISO(c.createdAt),
    })),
  }
}

export function apiToChangelogGame(game: ApiChangelogsGameI): ChangelogsGameI {
  return {
    id: game.id,
    name: game.name,
    playedTime: game.playedTime,
    extraPlayedTime: game.extraPlayedTime,
    imageUrl: game.imageUrl,
    mark: game.mark,
    achievements: {
      obtained: game.obtainedAchievements,
      total: game.totalAchievements,
    },
    changeLogs: game.changeLogs?.map((c) => ({
      ...c,
      createdAt: parseISO(c.createdAt),
    })),
  }
}

export function apiToChangelog(changeLog: ApiChangelog): ChangelogI {
  return {
    id: changeLog.id,
    gameId: changeLog.gameId,
    stateId: changeLog.stateId,
    createdAt: parseISO(changeLog.createdAt),
    hours: changeLog.hours,
    achievements: changeLog.achievements,
    game: {
      name: changeLog.game.name,
      imageUrl: changeLog.game.imageUrl,
    },
  }
}

export function apiToMemo(memo: ApiMemoGet): Memo {
  return {
    id: memo.id,
    value: memo.value,
    phrases: memo.wordPhrases.map((p) => p.phrase),
    definition: memo.definition,
    pronunciation: memo.pronunciation,
    priority: memo.priority,
    nextPractice: parseISO(memo.nextPractice),
    practiceListening: memo.practiceListening,
    practicePhrase: memo.practicePhrase,
    practicePronunciation: memo.practicePronunciation,
    practiceTranslation: memo.practiceTranslation,
    practiceWord: memo.practiceWord,
  }
}
