import { CreateParams, Paginable, UpdateParams } from './common'

export const contentType = {
  CHARACTER: 'CHARACTER',
  CHALLENGE: 'CHALLENGE',
}
type ContentType = keyof typeof contentType

interface IsaacPlayableContent {
  id: string
  name: string
  description?: string | null
  review?: string | null
  mark: number
  type: ContentType
}

export interface IsaacMod {
  id: string
  appid: bigint
  name: string
  wiki?: string | null
  items: number
  extra?: string | null
  playedAt?: Date | null
  isQoL: boolean
  isEnemies: boolean
  playableContents: IsaacPlayableContent[]
}

export interface IsaacModGetParams extends Paginable {
  appId?: bigint
  filter?: string[]
  contentType?: ContentType
  playedAt?: boolean
}

export type IsaacModUpdateInput = UpdateParams<IsaacMod>
export type IsaacModCreateInput = CreateParams<IsaacMod>

export interface IsaacAggregateResponse {
  total: number
  played: number
}
