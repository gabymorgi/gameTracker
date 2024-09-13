import { Word } from '@/ts/api/words'

export function getGPTMemoText(memo: Word) {
  const json = {
    word: memo.value,
    phrases: memo.phrases.map((phrase) => phrase.content),
  }
  return JSON.stringify(json)
}

export interface GPTObject {
  word: string
  pronuntiation: string
  priority: number
  definitions: Array<string>
  examples: Array<{
    english: string
    spanish: string
  }>
}
