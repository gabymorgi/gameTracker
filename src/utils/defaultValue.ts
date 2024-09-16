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
