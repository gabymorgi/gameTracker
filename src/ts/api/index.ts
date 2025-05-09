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
  Changelog,
  ChangelogCreateInput,
  ChangelogsGame,
  ChangelogsGetGamesParams,
  ChangelogsGetParams,
  ChangelogUpdateInput,
} from './changelogs'
import { IdParams, SearchParams } from './common'
import {
  Game,
  GameAggregateParams,
  GameAggregateResponse,
  GameCreateInput,
  GameDropResponse,
  GameGetParams,
  GameSearchResponse,
  GameTag,
  GameUpdateInput,
  GameWithChangelogs,
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
import {
  SteamAchievements,
  SteamAchievementsParams,
  SteamGameGetParams,
  SteamGames,
} from './steam'
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
  'changelogs/create': ApiRouteType<ChangelogCreateInput, Changelog>
  'changelogs/delete': ApiRouteType<IdParams, IdParams>
  'changelogs/games': ApiRouteType<ChangelogsGetGamesParams, ChangelogsGame[]>
  'changelogs/get': ApiRouteType<ChangelogsGetParams, Changelog[]>
  'changelogs/update': ApiRouteType<ChangelogUpdateInput, Changelog>
  'games/aggregates': ApiRouteType<GameAggregateParams, GameAggregateResponse>
  'games/create': ApiRouteType<GameCreateInput, Game>
  'games/delete': ApiRouteType<IdParams, IdParams>
  'games/drop': ApiRouteType<undefined, GameDropResponse>
  'games/get': ApiRouteType<GameGetParams, Game[]>
  'games/search': ApiRouteType<SearchParams, GameSearchResponse[]>
  'games/update': ApiRouteType<GameUpdateInput, Game>
  'isaac-mods/aggregates': ApiRouteType<undefined, IsaacAggregateResponse>
  'isaac-mods/create': ApiRouteType<IsaacModCreateInput, IsaacMod>
  'isaac-mods/delete': ApiRouteType<IdParams, IdParams>
  'isaac-mods/get': ApiRouteType<IsaacModGetParams, IsaacMod[]>
  'isaac-mods/update': ApiRouteType<IsaacModUpdateInput, IsaacMod>
  'steam/game': ApiRouteType<SteamGameGetParams, GameWithChangelogs[]>
  'steam/recentlyPlayed': ApiRouteType<undefined, SteamGames[]>
  'steam/playerAchievements': ApiRouteType<
    SteamAchievementsParams,
    SteamAchievements[]
  >
  'tags/delete': ApiRouteType<IdParams, IdParams>
  'tags/getGameTags': ApiRouteType<undefined, GameTag[]>
  'tags/get': ApiRouteType<undefined, Tag[]>
  'tags/upsert': ApiRouteType<Tag, Tag>
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
