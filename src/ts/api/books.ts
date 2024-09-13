import { CreateParams, Paginable, UpdateParams } from './common'

export const language = {
  ENGLISH: 'English',
  SPANISH: 'Spanish',
}
export type Language = keyof typeof bookState

export const bookState = {
  WANT_TO_READ: 'WANT_TO_READ',
  READING: 'READING',
  FINISHED: 'FINISHED',
  DROPPED: 'DROPPED',
}
// export enum BookState {
//   WANT_TO_READ = 'WANT_TO_READ',
//   READING = 'READING',
//   FINISHED = 'FINISHED',
//   DROPPED = 'DROPPED',
// }
export type BookState = keyof typeof bookState

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

export type BookUpdateInput = UpdateParams<Book>
export type BookCreateInput = CreateParams<Book>
