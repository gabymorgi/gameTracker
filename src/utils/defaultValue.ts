import { $Enums } from '#prisma-browser-client'

export const defaultNewChangelog = {
  createdAt: new Date(),
  hours: 0,
  achievements: 0,
  state: 'Playing',
}

export const defaultNewGame = {
  name: '',
  start: new Date(),
  end: new Date(),
  tags: [],
  state: 'Playing',
  playedTime: 0,
  obtainedAchievements: 0,
  totalAchievements: 0,
  platform: 'PC',
  changelogs: [defaultNewChangelog],
}

export const defaultNewBookChangelog = {
  createdAt: new Date(),
  pages: 0,
}

export const defaultIsaacMod = {
  appid: 0,
  name: '',
  wiki: '',
  items: 0,
  extra: '',
  playedAt: undefined,
  isQoL: false,
  isEnemies: false,
  playableContents: [],
}

export const defaultFactorioMod = {
  name: '',
  link: '',
  description: '',
  review: '',
  mark: -1,
  type: $Enums.FactorioModType.CONTENT,
  requirements: $Enums.FactorioRequirement.VANILLA,
  playedAt: undefined,
  dependencyIds: [],
}

export const defaultPlayableContent = {
  name: '',
  description: '',
  review: '',
  mark: -1,
  type: $Enums.ContentType.CHARACTER,
}
