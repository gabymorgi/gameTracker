import { BookChangelog } from './changelogs'
import { CreateParams, Paginable, UpdateParams } from './common'

const language = {
  ENGLISH: 'English',
  SPANISH: 'Spanish',
}
type Language = keyof typeof language

export const bookState = {
  WANT_TO_READ: 'WANT_TO_READ',
  READING: 'READING',
  FINISHED: 'FINISHED',
  DROPPED: 'DROPPED',
}
type BookState = keyof typeof bookState

export interface Book {
  id: string
  name: string
  start: Date
  state: BookState
  end: Date
  words: number
  language: string
  saga: string
  mark: number
  review: string | null
  imageUrl: string | null
}

export interface BooksGetParams extends Paginable {
  name?: string
  start?: Date
  end?: Date
  language?: Language
  state?: BookState
}

export type BookUpdateInput = UpdateParams<BookWithChangelogs>
export type BookCreateInput = CreateParams<BookWithChangelogs>

export interface BookStatisticParams {
  from: Date
  to: Date
}

export interface BookStatisticResponse {
  words: Array<{
    amount: number
    month_year: string
  }>
}

export interface BookWithChangelogs extends Book {
  changelogs: BookChangelog[]
}
