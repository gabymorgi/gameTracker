interface Phrase {
  id: string
  content: string
  translation: string | null
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
  value: string
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
