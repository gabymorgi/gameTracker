import { ThredMessage } from '@/contexts/ChatContext'
import { Memo } from '@/ts/books'

export function getGPTMemoText(memo: Memo) {
  return `{
  word: "${memo.word}",
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

export function parseGPTMemo(messages: ThredMessage[]): GPTObject | undefined {
  const text = messages[0]?.content[0].text.value
  // const regex = /```json([\s\S]*?)```/g
  // const match = regex.exec(text)
  // if (!match || !match[1]) {
  //   message.error('check console')
  //   console.warn('No match', text)
  //   return
  // }
  return JSON.parse(text) as GPTObject
}
