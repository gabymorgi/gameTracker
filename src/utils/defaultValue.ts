import { contentType } from '@/ts/api/isaac-mods'

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
  achievements: {
    obtained: 0,
    total: 0,
  },
  platform: 'PC',
  changelogs: [defaultNewChangelog],
}

export const defaultNewBookChangelog = {
  createdAt: new Date(),
  words: 0,
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

export const defaultPlayableContent = {
  name: '',
  description: '',
  review: '',
  mark: -1,
  type: contentType.CHARACTER,
}
