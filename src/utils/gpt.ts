import { Memo } from '@/ts/books'
import {
  Message,
  TextContentBlock,
} from 'openai/resources/beta/threads/messages.mjs'

export function getPlaygroundUrl(threadId: string) {
  return `https://platform.openai.com/playground/assistants?assistant=asst_Mhl8NXt9bsTm5QIVjnCIsRLr&mode=assistant&thread=${threadId}`
}

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

export function parseGPTMemo(messages: Message[]): GPTObject | undefined {
  const text = (messages[0]?.content[0] as TextContentBlock).text.value
  return JSON.parse(text) as GPTObject
}
