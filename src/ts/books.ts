export interface Phrase {
  id: string
  content: string
  translation: string
}

export enum Practice {
  LISTENING = 'practiceListening',
  PHRASE = 'practicePhrase',
  PRONUNCIATION = 'practicePronunciation',
  TRANSLATION = 'practiceTranslation',
  WORD = 'practiceWord',
}

export interface Memo {
  id: string
  word: string
  phrases: Phrase[]
  definition: string
  pronunciation: string
  priority: number
  nextPractice: Date
  [Practice.LISTENING]: number
  [Practice.PHRASE]: number
  [Practice.PRONUNCIATION]: number
  [Practice.TRANSLATION]: number
  [Practice.WORD]: number
}
