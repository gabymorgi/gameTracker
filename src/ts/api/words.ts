import { CreateParams, Paginable, UpdateParams } from './common'

export enum Practice {
  LISTENING = 'practiceListening',
  PHRASE = 'practicePhrase',
  PRONUNCIATION = 'practicePronunciation',
  TRANSLATION = 'practiceTranslation',
  WORD = 'practiceWord',
}

export interface Word {
  id: string
  value: string
  definition: string
  pronunciation: string
  priority: number
  nextPractice: Date
  [Practice.LISTENING]: number
  [Practice.PHRASE]: number
  [Practice.PRONUNCIATION]: number
  [Practice.TRANSLATION]: number
  [Practice.WORD]: number
  phrases: Array<{
    id: string
    content: string
    translation: string | null
  }>
}

export type WordSearch = Pick<Word, 'id' | 'value' | 'nextPractice'>

export type WordUpdateInput = UpdateParams<Word>
export type WordCreateInput = CreateParams<Word>

export interface WordGetParams extends Paginable {
  filterValues?: string[]
  excludeCompleted?: string
}

export interface WordStatisticsResponse {
  learnt: Array<{
    date: string
    amount: number
  }>
  inProgress: Record<number, number[]>
}
