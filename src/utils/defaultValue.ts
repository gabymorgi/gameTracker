export const defaultNewChangelog = {
  createdAt: new Date(),
  hours: 0,
  achievements: 0,
  stateId: 'Playing',
}

export const defaultNewGame = {
  name: '',
  start: new Date(),
  end: new Date(),
  tags: [],
  stateId: 'Playing',
  playedTime: 0,
  achievements: {
    obtained: 0,
    total: 0,
  },
  platform: 'PC',
  changeLogs: [defaultNewChangelog],
}
