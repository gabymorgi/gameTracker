import { $SafeAny } from '@/ts'
import {
  ApiAggregateI,
  ApiChangelog,
  ApiChangelogsGameI,
  ApiGame,
  ApiGameSearch,
  ApiGetGameTags,
  ApiLogin,
  ApiMemoFind,
  ApiMemoGet,
  ApiMemoSearch,
  ApiMemoStatistics,
  ApiSteamRecentlyPlayedI,
  ApiSteamAchievementsI,
  ApiBook,
  Tags,
} from '@/ts/api'

type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE'

type UnkownObject = Record<string, $SafeAny>

export type ApiPaths = {
  'books/create': UnkownObject
  'books/delete': UnkownObject
  'books/get': ApiBook[]
  'books/update': UnkownObject
  'changelogs/create': UnkownObject
  'changelogs/delete': UnkownObject
  'changelogs/games': ApiChangelogsGameI[]
  'changelogs/get': ApiChangelog[]
  'changelogs/update': UnkownObject
  'games/aggregates': ApiAggregateI
  'games/create': UnkownObject
  'games/delete': UnkownObject
  'games/drop': UnkownObject
  'games/get': ApiGame[]
  'games/search': ApiGameSearch[]
  'games/update': UnkownObject
  'steam/recentlyPlayed': ApiSteamRecentlyPlayedI[]
  'steam/playerAchievements': ApiSteamAchievementsI[]
  'tags/delete': UnkownObject
  'tags/getGameTags': ApiGetGameTags[]
  'tags/getGlobal': Tags[]
  'tags/upsert': UnkownObject
  'words/delete': UnkownObject
  'words/find': ApiMemoFind
  'words/get': ApiMemoGet[]
  'words/learn': UnkownObject
  'words/progress': UnkownObject
  'words/search': ApiMemoSearch[]
  'words/statistics': ApiMemoStatistics
  'words/upsert': UnkownObject
  login: ApiLogin
}

export const pathToMethod: Record<keyof ApiPaths, HttpMethod> = {
  'books/create': 'POST',
  'books/delete': 'DELETE',
  'books/get': 'GET',
  'books/update': 'PUT',
  'changelogs/create': 'POST',
  'changelogs/delete': 'DELETE',
  'changelogs/games': 'GET',
  'changelogs/get': 'GET',
  'changelogs/update': 'PUT',
  'games/aggregates': 'GET',
  'games/create': 'POST',
  'games/delete': 'DELETE',
  'games/drop': 'PUT',
  'games/get': 'GET',
  'games/search': 'GET',
  'games/update': 'PUT',
  'steam/recentlyPlayed': 'GET',
  'steam/playerAchievements': 'GET',
  'tags/delete': 'DELETE',
  'tags/getGameTags': 'GET',
  'tags/getGlobal': 'GET',
  'tags/upsert': 'POST',
  'words/delete': 'DELETE',
  'words/find': 'GET',
  'words/get': 'GET',
  'words/learn': 'PUT',
  'words/progress': 'PUT',
  'words/search': 'GET',
  'words/statistics': 'GET',
  'words/upsert': 'POST',
  login: 'POST',
}
