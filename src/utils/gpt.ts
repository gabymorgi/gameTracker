import { Memo } from '@/ts/books'
import {
  Message,
  TextContentBlock,
} from 'openai/resources/beta/threads/messages.mjs'

export function getGPTMemoText(memo: Memo) {
  return `{
  word: "${memo.value}",
  phrases: [
    ${
      memo.phrases.length
        ? `"${memo.phrases.map((phrase) => phrase.content).join('",\n    "')}"`
        : ''
    }
  ]
}`
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

export function parseGPTMemo(messages: Message[]): GPTObject | undefined {
  const text = (messages[0]?.content[0] as TextContentBlock).text.value
  return JSON.parse(text) as GPTObject
}
