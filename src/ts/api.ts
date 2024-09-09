import { $SafeAny, CRUDArray, SortDirection } from '@/ts'
import {
  Book,
  BookState,
  ChangeLog as PrismaChangeLog,
  Game as PrismaGame,
  Phrase,
  Prisma,
  Tags,
  Word,
  GameTag,
} from '@prisma/client'

export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE'

// ######### GENERICS ########

interface Changelog extends PrismaChangeLog {
  state: string
}

interface IdParams {
  id: string
}

interface SearchParams {
  id?: string
  search?: string
}

interface Paginable {
  take?: number
  skip?: number
  sortBy?: string
  sortDirection?: SortDirection
}

type WithStringId<T> = Omit<T, 'id'> & { id: string }

// ########## BOOKS ##########

interface BooksGetParams extends Paginable {
  name?: string
  start?: Date
  end?: Date
  language?: 'English' | 'Spanish'
  state?: BookState
}

type BookUpdateInput = WithStringId<Prisma.BookUpdateInput>

// ########## GAMES ##########

export interface Game extends PrismaGame {
  tags: string[]
  state: string
  achievements: {
    obtained: number
    total: number
  }
}

export interface GameWithChangeLogs extends Game {
  changeLogs: Changelog[]
}

interface GameAggregateParams {
  from: Date
  to: Date
}

interface GameAggregateResponse {
  playedTime: Array<{
    hours: number
    achievements: number
    month_year: string
    sum: number
  }>
  states: Array<{
    state: GameState
    count: number
  }>
  tags: Array<{
    tagId: string
    total_hours: number
  }>
}

interface CreateGameParams extends Prisma.GameCreateInput {
  stateId: string
  achievements: {
    obtained: number
    total: number
  }
  tags: CRUDArray<string>
  changeLogs: CRUDArray<Prisma.ChangeLogUncheckedCreateInput>
}

interface GameDropResponse {
  updateGames: Prisma.BatchPayload
  updatedChangelog: Prisma.BatchPayload
}

interface GameGetParams extends ChangelogsGetGamesParams {
  includeChangeLogs?: boolean
}

type GameSearchResponse = Pick<Game, 'id' | 'name' | 'imageUrl'>

// ######## CHANGELOGS #######

interface ChangeLogCreateInput extends Prisma.ChangeLogCreateInput {
  gameId: string
  stateId: string
}

export type ChangelogGame = Pick<
  Game,
  'id' | 'name' | 'playedTime' | 'extraPlayedTime' | 'imageUrl' | 'achievements'
> & {
  changeLogs: Pick<
    Changelog,
    'gameId' | 'id' | 'stateId' | 'createdAt' | 'hours' | 'achievements'
  >[]
}

interface ChangelogsGetParams extends Paginable {
  from: Date
  to: Date
  gameId: string
}

interface ChangeLogUpdateInput
  extends WithStringId<Prisma.ChangeLogUpdateInput> {
  gameId: string
  stateId: string
}

interface ChangelogsGetGamesParams extends Paginable {
  gameId: string
  name?: string
  start?: Date
  end?: Date
  state?: string
  tags?: string[]
  appids?: number[]
  includeChangeLogs?: boolean
}

// ########## WORDS ##########

type WordUpdateInput = WithStringId<Prisma.WordUpdateInput>

type WordSearch = Pick<Word, 'id' | 'value' | 'nextPractice'>

interface WordWithPhrases extends Word {
  phrases: Phrase[]
}

interface WordUpdateParams extends Prisma.WordCreateInput {
  phrases: CRUDArray<Prisma.PhraseUncheckedCreateInput>
}

interface WordDeleteResponse {
  word: Word
  wordPhrases: Prisma.BatchPayload
  phrases: Prisma.BatchPayload
}

interface WordGetParams extends Paginable {
  filterValues?: string
  excludeCompleted?: string
}

interface WordStatisticsResponse {
  learnt: Array<{
    date: string
    amount: number
  }>
  inProgress: Record<number, number[]>
}

// ########## STEAM ##########
interface SteamGames {
  appid: number
  name: string
  playtime_2weeks: number
  playtime_forever: number
  img_icon_url: string
  playtime_windows_forever: number
  playtime_mac_forever: number
  playtime_linux_forever: number
}

interface SteamAchievementsParams {
  appid: string
}

interface SteamAchievements {
  apiname: string
  achieved: number
  unlocktime: number
  name: string
  description: string
}

// ########## Rest ##########

interface UpdateGameParams
  extends Omit<Prisma.GameUpdateInput, 'changeLogs' | 'id'> {
  id: string
  tags: CRUDArray<string>
  changeLogs: CRUDArray<Prisma.ChangeLogUncheckedCreateInput>
}

interface LoginParams {
  email: string
  password: string
}

interface LoginResponse {
  token: string
}

export interface ApiRouteType<TParams, TRes> {
  params: TParams
  response: TRes
}

export type MutationPaths = {
  'books/create': ApiRouteType<Prisma.BookCreateInput, IdParams>
  'books/delete': ApiRouteType<IdParams, IdParams>
  'books/update': ApiRouteType<BookUpdateInput, IdParams>
  'changelogs/create': ApiRouteType<ChangeLogCreateInput, IdParams>
  'changelogs/delete': ApiRouteType<IdParams, IdParams>
  'changelogs/update': ApiRouteType<ChangeLogUpdateInput, IdParams>
  'games/create': ApiRouteType<CreateGameParams, IdParams>
  'games/delete': ApiRouteType<IdParams, IdParams>
  'games/drop': ApiRouteType<undefined, GameDropResponse>
  'games/update': ApiRouteType<CreateGameParams, IdParams>
  'tags/delete': ApiRouteType<IdParams, Tags>
  'tags/upsert': ApiRouteType<Prisma.TagsCreateInput, Tags>
  'words/delete': ApiRouteType<IdParams, WordDeleteResponse>
  'words/learn': ApiRouteType<IdParams, WordDeleteResponse>
  'words/progress': ApiRouteType<WordUpdateInput, Word>
  'words/upsert': ApiRouteType<WordUpdateParams, WordDeleteResponse>
  login: ApiRouteType<LoginParams, LoginResponse>
}

export type QueryPaths = {
  'books/get': ApiRouteType<BooksGetParams, Book[]>
  'changelogs/games': ApiRouteType<ChangelogsGetGamesParams, ChangelogGame[]>
  'changelogs/get': ApiRouteType<ChangelogsGetParams, Changelog[]>
  'games/aggregates': ApiRouteType<GameAggregateParams, GameAggregateResponse>
  'games/get': ApiRouteType<GameGetParams, Game[]>
  'games/search': ApiRouteType<SearchParams, GameSearchResponse[]>
  'steam/recentlyPlayed': ApiRouteType<undefined, SteamGames[]>
  'steam/playerAchievements': ApiRouteType<
    SteamAchievementsParams,
    SteamAchievements[]
  >
  'tags/getGameTags': ApiRouteType<undefined, GameTag[]>
  'tags/get': ApiRouteType<undefined, Tags[]>
  'words/find': ApiRouteType<IdParams, Word | null>
  'words/get': ApiRouteType<WordGetParams, WordWithPhrases[]>
  'words/search': ApiRouteType<SearchParams, WordSearch[]>
  'words/statistics': ApiRouteType<undefined, WordStatisticsResponse>
}

export type ApiPaths = MutationPaths & QueryPaths

// Utiliza una condición de tipo para verificar si un tipo es un arreglo
type IfArray<T, U> = T extends Array<$SafeAny> ? U : never

// Filtra las rutas para obtener solo aquellas cuyas respuestas son arreglos
export type ApiPaginablePaths = {
  [K in keyof QueryPaths as IfArray<
    QueryPaths[K]['response'],
    K
  >]: QueryPaths[K]
}

interface CrudApiRouteType<TGetParams, TCreateParams, TUpdateParams, TGetRes> {
  get: ApiRouteType<TGetParams, TGetRes[]>
  create: ApiRouteType<TCreateParams, TGetRes>
  update: ApiRouteType<TUpdateParams, TGetRes>
  delete: ApiRouteType<IdParams, TGetRes>
}

export type ApiCrudPaths = {
  games: CrudApiRouteType<
    GameGetParams,
    CreateGameParams,
    UpdateGameParams,
    Game
  >
  // otros endpoints
}
