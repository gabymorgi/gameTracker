import type { FactorioMod as PrismaFactorioMod } from '#prisma-browser-client'
import type { Paginable } from './common'

export type FactorioModGetParams = Paginable & {
  name?: string
  type?: PrismaFactorioMod['type']
  playedAt?: boolean
  hideModsWithDependencies?: boolean
}

export type FactorioModWithDependencies = PrismaFactorioMod & {
  dependencies: PrismaFactorioMod[]
}

export type FactorioModFormValues = Omit<PrismaFactorioMod, 'id'> & {
  dependencyIds: string[]
}

export type FactorioModCreateParams = FactorioModFormValues

export type FactorioModUpdateParams = Partial<FactorioModFormValues> & {
  id: string
}

export type FactorioModSearch = Pick<PrismaFactorioMod, 'id' | 'name'>

export interface FactorioModSearchParams {
  id?: string
  search?: string
}
