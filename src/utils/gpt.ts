import { Memo } from '@/ts/books'

export function getGPTMemoText(memo: Memo) {
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
