import {
  Book,
  BookCreateInput,
  BooksGetParams,
  BookStatisticParams,
  BookStatisticResponse,
  BookUpdateInput,
} from './books'
import {
  BookChangelog,
  BookChangelogsGetParams,
  ChangelogCreateInput,
  ChangelogsGame,
  ChangelogsGetGamesParams,
  ChangelogsGetParams,
  ChangelogUpdateInput,
  ChangelogWithGame,
} from './changelogs'
import { IdParams, SearchParams } from './common'
import {
  Game,
  GameAggregateParams,
  GameAggregateResponse,
  GameCreateInput,
  GameGetParams,
  GameSearchResponse,
  GameTag,
  GameUpdateInput,
  Tag,
} from './games'
import {
  IsaacAggregateResponse,
  IsaacMod,
  IsaacModCreateInput,
  IsaacModGetParams,
  IsaacModUpdateInput,
} from './isaac-mods'
import { LoginParams, LoginResponse } from './login'
import { Notification } from './notifications'
import {
  Word,
  WordCreateInput,
  WordGetParams,
  WordSearch,
  WordStatisticsResponse,
  WordUpdateInput,
} from './words'

interface ApiRouteType<TParams, TRes> {
  params: TParams
  response: TRes
}

export type ApiPaths = {
  'books/create': ApiRouteType<BookCreateInput, Book>
  'books/delete': ApiRouteType<IdParams, IdParams>
  'books/get': ApiRouteType<BooksGetParams, Book[]>
  'books/statistics': ApiRouteType<BookStatisticParams, BookStatisticResponse>
  'books/update': ApiRouteType<BookUpdateInput, Book>
  'changelogs/bookGet': ApiRouteType<BookChangelogsGetParams, BookChangelog[]>
  'changelogs/create': ApiRouteType<ChangelogCreateInput, ChangelogWithGame>
  'changelogs/delete': ApiRouteType<IdParams, IdParams>
  'changelogs/games': ApiRouteType<ChangelogsGetGamesParams, ChangelogsGame[]>
  'changelogs/get': ApiRouteType<ChangelogsGetParams, ChangelogWithGame[]>
  'changelogs/update': ApiRouteType<ChangelogUpdateInput, ChangelogWithGame>
  'games/aggregates': ApiRouteType<GameAggregateParams, GameAggregateResponse>
  'games/create': ApiRouteType<GameCreateInput, Game>
  'games/delete': ApiRouteType<IdParams, IdParams>
  'games/get': ApiRouteType<GameGetParams, Game[]>
  'games/pending': ApiRouteType<undefined, Game[]>
  'games/search': ApiRouteType<SearchParams, GameSearchResponse[]>
  'games/update': ApiRouteType<GameUpdateInput, Game>
  'isaac-mods/aggregates': ApiRouteType<undefined, IsaacAggregateResponse>
  'isaac-mods/create': ApiRouteType<IsaacModCreateInput, IsaacMod>
  'isaac-mods/delete': ApiRouteType<IdParams, IdParams>
  'isaac-mods/get': ApiRouteType<IsaacModGetParams, IsaacMod[]>
  'isaac-mods/update': ApiRouteType<IsaacModUpdateInput, IsaacMod>
  'tags/delete': ApiRouteType<IdParams, IdParams>
  'tags/getGameTags': ApiRouteType<undefined, GameTag[]>
  'tags/get': ApiRouteType<undefined, Tag[]>
  'tags/upsert': ApiRouteType<Tag, Tag>
  'notifications/delete': ApiRouteType<IdParams, IdParams>
  'notifications/get': ApiRouteType<undefined, Notification[]>
  'words/delete': ApiRouteType<IdParams, IdParams>
  'words/find': ApiRouteType<IdParams, Word | null>
  'words/get': ApiRouteType<WordGetParams, Word[]>
  'words/learn': ApiRouteType<IdParams, IdParams>
  'words/create': ApiRouteType<WordCreateInput, Word>
  'words/search': ApiRouteType<SearchParams, WordSearch[]>
  'words/statistics': ApiRouteType<undefined, WordStatisticsResponse>
  'words/update': ApiRouteType<WordUpdateInput, Word>
  login: ApiRouteType<LoginParams, LoginResponse>
}
