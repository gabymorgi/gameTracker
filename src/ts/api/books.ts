import {
  $Enums,
  Book as PrismaBook,
  BookChangelog as PrismaBookChangelog,
} from '#prisma-generated-client'
import { CreateParams, Paginable, UpdateParams } from './common'

type Language = 'ENGLISH' | 'SPANISH'
export type Book = PrismaBook
export type BookChangelog = Omit<PrismaBookChangelog, 'bookId'>

export interface BooksGetParams extends Paginable {
  name?: string
  start?: Date
  end?: Date
  language?: Language
  state?: $Enums.BookState
}

export interface BooksGetChangelog extends Book {
  changelogs: Omit<BookChangelog, 'bookId'>[]
}

export interface BookChangelogsGetParams {
  bookId: string
}

export type BookUpdateParams = UpdateParams<BooksGetChangelog>
export type BookCreateParams = CreateParams<BooksGetChangelog>

export interface BookStatisticParams {
  from: Date
  to: Date
}

export interface BookStatistic {
  words: Array<{
    amount: number
    month_year: string
  }>
}
