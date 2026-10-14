import type { FactorioModWithDependencies } from '@/ts/api/factorio-mods'

export const modTypeLabels: Record<
  FactorioModWithDependencies['type'],
  { label: string; color: string }
> = {
  PLANET: { label: 'Planet', color: 'blue' },
  OVERHAUL: { label: 'Overhaul', color: 'red' },
  CONTENT: { label: 'Content', color: 'lime' },
  MOD_PACK: { label: 'Mod Pack', color: 'gold' },
}

export const requirementLabels: Record<
  FactorioModWithDependencies['requirements'],
  { label: string; color: string }
> = {
  VANILLA: { label: 'Vanilla', color: 'magenta' },
  NEW_SAVE: { label: 'New save', color: 'orange' },
  SPACE: { label: 'Space Age', color: '' },
  VULCANUS: { label: 'Vulcanus', color: 'volcano' },
  FULGORA: { label: 'Fulgora', color: 'purple' },
  GLEBA: { label: 'Gleba', color: 'green' },
  AQUILO: { label: 'Aquilo', color: 'cyan' },
}
