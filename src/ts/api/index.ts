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
  GameStatisticsParams,
  GameStatisticsResponse,
  GameCreateInput,
  GameGetParams,
  GameOst,
  GameSearchResponse,
  GameTags,
  GameUpdateInput,
  Tag,
} from './games'
import {
  IsaacStatisticsResponse,
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
  'books/getChangelogs': ApiRouteType<BookChangelogsGetParams, BookChangelog[]>
  'books/statistics': ApiRouteType<BookStatisticParams, BookStatisticResponse>
  'books/update': ApiRouteType<BookUpdateInput, Book>
  'changelogs/create': ApiRouteType<ChangelogCreateInput, ChangelogWithGame>
  'changelogs/delete': ApiRouteType<IdParams, IdParams>
  'changelogs/get': ApiRouteType<ChangelogsGetParams, ChangelogWithGame[]>
  'changelogs/update': ApiRouteType<ChangelogUpdateInput, ChangelogWithGame>
  'games/statistics': ApiRouteType<GameStatisticsParams, GameStatisticsResponse>
  'games/create': ApiRouteType<GameCreateInput, Game>
  'games/delete': ApiRouteType<IdParams, IdParams>
  'games/get': ApiRouteType<GameGetParams, Game[]>
  'games/getWithChangelogs': ApiRouteType<
    ChangelogsGetGamesParams,
    ChangelogsGame[]
  >
  'games/getOsts': ApiRouteType<undefined, GameOst[]>
  'games/getPending': ApiRouteType<undefined, Game[]>
  'games/search': ApiRouteType<SearchParams, GameSearchResponse[]>
  'games/update': ApiRouteType<GameUpdateInput, Game>
  'isaac-mods/statistics': ApiRouteType<undefined, IsaacStatisticsResponse>
  'isaac-mods/create': ApiRouteType<IsaacModCreateInput, IsaacMod>
  'isaac-mods/delete': ApiRouteType<IdParams, IdParams>
  'isaac-mods/get': ApiRouteType<IsaacModGetParams, IsaacMod[]>
  'isaac-mods/update': ApiRouteType<IsaacModUpdateInput, IsaacMod>
  'tags/delete': ApiRouteType<IdParams, IdParams>
  'tags/getGameTags': ApiRouteType<undefined, GameTags[]>
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
