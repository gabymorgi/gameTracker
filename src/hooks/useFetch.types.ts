import {
  ApiAggregateI,
  ApiChangelog,
  ApiChangelogsGameI,
  ApiGame,
  ApiGameSearch,
  ApiGetGameTags,
  ApiGetGlobalTags,
  ApiLogin,
  ApiOpenAICreate,
  ApiOpenAIGet,
  ApiOpenAISend,
  ApiPhrasesGet,
  ApiMemoFind,
  ApiMemoGet,
  ApiMemoSearch,
  ApiMemoStatistics,
  ApiSteamRecentlyPlayedI,
  ApiSteamAchievementsI,
} from '@/ts/api'

type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE'

type UnkownObject = Record<string, string>

export type ApiPaths = {
  'changelogs/create': UnkownObject
  'changelogs/delete': UnkownObject
  'changelogs/games': ApiChangelogsGameI[]
  'changelogs/get': ApiChangelog[]
  'changelogs/update': UnkownObject
  'games/aggregates': ApiAggregateI
  'games/create': UnkownObject
  'games/delete': UnkownObject
  'games/get': ApiGame[]
  'games/search': ApiGameSearch[]
  'games/update': UnkownObject
  'openAI/create': ApiOpenAICreate
  'openAI/delete': UnkownObject
  'openAI/get': ApiOpenAIGet
  'openAI/send': ApiOpenAISend
  'phrases/delete': UnkownObject
  'phrases/get': ApiPhrasesGet[]
  'phrases/import': UnkownObject
  'steam/recentlyPlayed': ApiSteamRecentlyPlayedI[]
  'steam/playerAchievements': ApiSteamAchievementsI
  'tags/delete': UnkownObject
  'tags/getGameTags': ApiGetGameTags[]
  'tags/getGlobal': ApiGetGlobalTags
  'tags/upsert': UnkownObject
  'words/delete': UnkownObject
  'words/find': ApiMemoFind
  'words/get': ApiMemoGet[]
  'words/import': UnkownObject
  'words/learn': UnkownObject
  'words/progress': UnkownObject
  'words/search': ApiMemoSearch[]
  'words/statistics': ApiMemoStatistics
  'words/upsert': UnkownObject
  login: ApiLogin
}

export const pathToMethod: Record<keyof ApiPaths, HttpMethod> = {
  'changelogs/create': 'POST',
  'changelogs/delete': 'DELETE',
  'changelogs/games': 'GET',
  'changelogs/get': 'GET',
  'changelogs/update': 'PUT',
  'games/aggregates': 'GET',
  'games/create': 'POST',
  'games/delete': 'DELETE',
  'games/get': 'GET',
  'games/search': 'GET',
  'games/update': 'PUT',
  'openAI/create': 'POST',
  'openAI/delete': 'DELETE',
  'openAI/get': 'GET',
  'openAI/send': 'POST',
  'phrases/delete': 'DELETE',
  'phrases/get': 'GET',
  'phrases/import': 'POST',
  'steam/recentlyPlayed': 'GET',
  'steam/playerAchievements': 'GET',
  'tags/delete': 'DELETE',
  'tags/getGameTags': 'GET',
  'tags/getGlobal': 'GET',
  'tags/upsert': 'POST',
  'words/delete': 'DELETE',
  'words/find': 'GET',
  'words/get': 'GET',
  'words/import': 'POST',
  'words/learn': 'PUT',
  'words/progress': 'PUT',
  'words/search': 'GET',
  'words/statistics': 'GET',
  'words/upsert': 'POST',
  login: 'POST',
}
