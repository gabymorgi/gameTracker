import { CreateParams, Paginable, UpdateParams } from './common'
import {
  $Enums,
  IsaacMod as PrismaIsaacMod,
  IsaacPlayableContent as PrismaIsaacPlayableContent,
} from '#prisma-client'

export type IsaacMod = PrismaIsaacMod
export type IsaacPlayableContent = Omit<PrismaIsaacPlayableContent, 'modId'>

export interface IsaacModGetParams extends Paginable {
  appId?: bigint
  filter?: string[]
  contentType?: $Enums.ContentType
  playedAt?: boolean
}

export interface IsaacModWithContent extends PrismaIsaacMod {
  playableContents: PrismaIsaacPlayableContent[]
}

export type IsaacModUpdateParams = UpdateParams<IsaacModWithContent>
export type IsaacModCreateParams = CreateParams<IsaacModWithContent>

export interface IsaacStatistics {
  total: number
  played: number
}
