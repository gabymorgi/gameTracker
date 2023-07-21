export interface ExtraScoreI {
  bias: number
  info: string
}

export interface ScoreI {
  content: number | null
  lore: number | null
  mechanics: number | null
  bosses: number | null
  controls: number | null
  music: number | null
  graphics: number | null
  extra: Array<ExtraScoreI> | null
  finalMark: number
}

export interface DocumentGameI {
  appid: number | null
  name: string
  start: number
  tags: Array<string>
  state: string
  end: number
  hours: number | null
  score: ScoreI | null
  imageUrl: string | null
  achievements: [number, number]
}

export interface GameI extends DocumentGameI {
  id: string
}

export interface ExtendedGameI extends GameI {
  oldHours: number | null
}

export interface DocumentAggregateI {
  achievements: number
  hours: number
  month: number
  states: { [key: string]: number }
  tags: { [key: string]: number }
}

export interface AggregateI extends DocumentAggregateI {
  id: string
}

export interface DocumentChangelogI {
  achievements: number
  createdAt: number
  gameId: string
  gameName: string
  hours: number
  state: string
}

export interface ChangelogI extends DocumentChangelogI {
  id: string
}
