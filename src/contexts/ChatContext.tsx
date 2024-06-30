import { createContext, useRef, useState } from 'react'
import { query } from '../hooks/useFetch'
import OpenAI from 'openai'
import { useLocalStorage } from 'usehooks-ts'
import { getPlaygroundUrl } from '@/utils/gpt'

const threadIdKey = 'openai-thread-id'
const threadMessagesKey = 'openai-thread-messages'

type ThredMessage = OpenAI.Beta.Threads.Messages.Message

interface GPTResponse {
  status: 'completed' | 'failed'
  messages: ThredMessage[]
}

interface IChatContext {
  threadId: string
  loading: boolean
  messagesCount: number
  createThread: () => Promise<void>
  getMessages: () => Promise<void>
  sendMessage: (
    message: string,
    callback?: (res: GPTResponse) => void,
  ) => Promise<void>
  deleteThread: () => Promise<void>
}

export const ChatContext = createContext<IChatContext>({} as IChatContext)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messagesCount, setMessagesCount] = useLocalStorage<number>(
    threadMessagesKey,
    0,
  )
  const [loading, setLoading] = useState(false)
  const [threadId, setThreadId, removeThreadId] = useLocalStorage<string>(
    threadIdKey,
    '',
  )
  const callbackRef = useRef<(res: GPTResponse) => void>()

  async function createThread() {
    setLoading(true)
    const res = await query('openAI/create')
    setMessagesCount(0)
    setThreadId(res.threadId)
    setLoading(false)
  }

  async function sendMessage(
    message: string,
    callback?: (res: GPTResponse) => void,
  ) {
    setMessagesCount((prev) => prev + 1)
    setLoading(true)
    const res = await query('openAI/send', {
      threadId,
      message,
    })
    callbackRef.current = callback
    setTimeout(() => {
      getMessages(threadId, res.runId)
    }, 3000)
  }

  async function getMessages(thread = threadId, run?: string, attempt = 0) {
    setLoading(true)
    const res = await query('openAI/get', {
      runId: run,
      threadId: thread,
    })

    if (!res.completed && attempt < 10) {
      setTimeout(() => {
        getMessages(thread, run, attempt + 1)
      }, 3000)
    } else {
      const status = res.completed ? 'completed' : 'failed'
      if (!res.completed) {
        // Manejo del caso cuando se alcanza el número máximo de intentos
        console.error(
          'Max attempts reached, go to playground for more info',
          getPlaygroundUrl(thread),
        )
      }
      if (callbackRef.current) {
        callbackRef.current({
          status,
          messages: res.messages,
        })
        callbackRef.current = undefined
      }
      setLoading(false)
    }
  }

  async function deleteThread() {
    await query('openAI/delete', { threadId })
    removeThreadId()
  }

  return (
    <ChatContext.Provider
      value={{
        messagesCount,
        createThread,
        threadId,
        loading,
        sendMessage,
        getMessages,
        deleteThread,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
