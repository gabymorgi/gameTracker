import {
  $Enums,
  Book as PrismaBook,
  BookChangelog as PrismaBookChangelog,
  Prisma,
} from '#prisma-browser-client'
import { CreateParams, Paginable, UpdateParams } from './common'

type Language = 'ENGLISH' | 'SPANISH'
export type Book = PrismaBook
export type BookChangelog = Omit<PrismaBookChangelog, 'bookId'>

export const bookChangelogsInclude = {
  changelogs: {
    select: { id: true, createdAt: true, pages: true },
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.BookInclude

export const bookTimelineSelect = {
  id: true,
  createdAt: true,
  pages: true,
  book: {
    select: {
      id: true,
      name: true,
      imageUrl: true,
      language: true,
      state: true,
      pages: true,
    },
  },
} satisfies Prisma.BookChangelogSelect

export type BookWithChangelogs = Prisma.BookGetPayload<{
  include: typeof bookChangelogsInclude
}>
export type BookTimelineEntry = Prisma.BookChangelogGetPayload<{
  select: typeof bookTimelineSelect
}>

export interface BooksGetParams extends Paginable {
  name?: string
  start?: Date
  end?: Date
  language?: Language
  state?: $Enums.BookState
}

export interface BooksTimelineGetParams extends Paginable {
  name?: string
  start?: Date
  end?: Date
  language?: Language
  state?: $Enums.BookState
}

export interface BookChangelogsGetParams {
  bookId: string
}

export type BookUpdateParams = UpdateParams<BookWithChangelogs>
export type BookCreateParams = CreateParams<BookWithChangelogs>

export interface BookStatisticParams {
  from: Date
  to: Date
}

export interface BookStatistic {
  pages: Array<{
    amount: number
    month_year: string
  }>
}
