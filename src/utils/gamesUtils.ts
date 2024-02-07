import { FormGameI, GameI } from '@/ts'

export function gameToForm(game: GameI): FormGameI {
  const { gameTags, obtainedAchievements, totalAchievements, ...cleanGame } =
    game
  return {
    ...cleanGame,
    tags: game.gameTags?.map((t) => t.tagId),
    achievements: {
      obtained: game.obtainedAchievements,
      total: game.totalAchievements,
    },
  }
}

export function formToGame(form: FormGameI): GameI {
  const { tags, achievements, ...cleanForm } = form
  return {
    ...cleanForm,
    gameTags: tags?.map((t) => ({ tagId: t })),
    obtainedAchievements: achievements?.obtained,
    totalAchievements: achievements?.total,
  }
}
