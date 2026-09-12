import {
  BookCreateParams,
  BooksGetParams,
  BookStatisticParams,
  BookStatistic,
  BookUpdateParams,
  BookChangelogsGetParams,
  Book,
  BookChangelog,
} from './books'
import {
  ChangelogGet,
  ChangelogCreateParams,
  ChangelogsGetParams,
  ChangelogUpdateParams,
  Changelog,
} from './changelogs'
import { IdParams } from './common'
import {
  GameWithChangelogs,
  GameStatisticsParams,
  GameStatistics,
  GameCreateParams,
  GameGetParams,
  GameOst,
  GameSearch,
  GameTags,
  GameUpdateParams,
  GameSearchParams,
  Game,
} from './games'
import {
  IsaacStatistics,
  IsaacModCreateParams,
  IsaacModGetParams,
  IsaacModUpdateParams,
  IsaacModWithContent,
} from './isaac-mods'
import { LoginParams, Login } from './login'
import { Notification } from './notifications'
import { Tag } from '#prisma-client'

interface ApiRouteType<TParams, TRes> {
  params: TParams
  response: TRes
}

export type ApiPaths = {
  'books/create': ApiRouteType<BookCreateParams, Book>
  'books/delete': ApiRouteType<IdParams, IdParams>
  'books/get': ApiRouteType<BooksGetParams, Book[]>
  'books/getChangelogs': ApiRouteType<BookChangelogsGetParams, BookChangelog[]>
  'books/statistics': ApiRouteType<BookStatisticParams, BookStatistic>
  'books/update': ApiRouteType<BookUpdateParams, Book>
  'changelogs/create': ApiRouteType<ChangelogCreateParams, Changelog>
  'changelogs/delete': ApiRouteType<IdParams, IdParams>
  'changelogs/get': ApiRouteType<ChangelogsGetParams, ChangelogGet[]>
  'changelogs/update': ApiRouteType<ChangelogUpdateParams, Changelog>
  'games/statistics': ApiRouteType<GameStatisticsParams, GameStatistics>
  'games/create': ApiRouteType<GameCreateParams, Game>
  'games/delete': ApiRouteType<IdParams, IdParams>
  'games/get': ApiRouteType<GameGetParams, Game[]>
  'games/getWithChangelogs': ApiRouteType<GameGetParams, GameWithChangelogs[]>
  'games/getOsts': ApiRouteType<undefined, GameOst[]>
  'games/getPending': ApiRouteType<undefined, Game[]>
  'games/search': ApiRouteType<GameSearchParams, GameSearch[]>
  'games/update': ApiRouteType<GameUpdateParams, Game>
  'isaac-mods/statistics': ApiRouteType<undefined, IsaacStatistics>
  'isaac-mods/create': ApiRouteType<IsaacModCreateParams, IsaacModWithContent>
  'isaac-mods/delete': ApiRouteType<IdParams, IdParams>
  'isaac-mods/get': ApiRouteType<IsaacModGetParams, IsaacModWithContent[]>
  'isaac-mods/update': ApiRouteType<IsaacModUpdateParams, IsaacModWithContent>
  'tags/delete': ApiRouteType<IdParams, IdParams>
  'tags/getGameTags': ApiRouteType<undefined, GameTags[]>
  'tags/get': ApiRouteType<undefined, Tag[]>
  'tags/upsert': ApiRouteType<Tag, Tag>
  'notifications/delete': ApiRouteType<IdParams, IdParams>
  'notifications/get': ApiRouteType<undefined, Notification[]>
  login: ApiRouteType<LoginParams, Login>
}
