import { FormGameI, GameI } from '@/ts'
import { parseISO } from 'date-fns'

export function gameToForm(game: GameI): FormGameI {
  const { gameTags, obtainedAchievements, totalAchievements, ...cleanGame } =
    game
  return {
    ...cleanGame,
    start: parseISO(game.start),
    end: parseISO(game.end),
    tags: game.gameTags?.map((t) => t.tagId),
    achievements: {
      obtained: game.obtainedAchievements,
      total: game.totalAchievements,
    },
    changeLogs: game.changeLogs?.map((c) => ({
      ...c,
      createdAt: parseISO(c.createdAt),
    })),
  }
}

export function formToGame(form: FormGameI): GameI {
  const { tags, achievements, ...cleanForm } = form
  return {
    ...cleanForm,
    start: form.start.toISOString(),
    end: form.end.toISOString(),
    gameTags: tags?.map((t) => ({ tagId: t })),
    obtainedAchievements: achievements?.obtained,
    totalAchievements: achievements?.total,
    changeLogs: form.changeLogs?.map((c) => ({
      ...c,
      id: c.id || '',
      createdAt: c.createdAt.toISOString(),
    })),
  }
}
