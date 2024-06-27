import { createContext, useRef, useState } from 'react'
import { query } from '../hooks/useFetch'
import OpenAI from 'openai'
import { useLocalStorage } from 'usehooks-ts'
import { message } from './GlobalContext'

const threadIdKey = 'openai-thread-id'

type ThredMessage = OpenAI.Beta.Threads.Messages.Message

interface IChatContext {
  threadId: string
  loading: boolean
  createThread: () => Promise<void>
  getMessages: () => Promise<void>
  sendMessage: (
    message: string,
    callback?: (res: ThredMessage[]) => void,
  ) => Promise<void>
  deleteChat: () => Promise<void>
}

export const ChatContext = createContext<IChatContext>({} as IChatContext)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false)
  const [threadId, setThreadId, removeThreadId] = useLocalStorage<string>(
    threadIdKey,
    '',
    { deserializer: (v) => v },
  )
  const callbackRef = useRef<(res: ThredMessage[]) => void>()

  async function createThread() {
    setLoading(true)
    const res = await query('openAI/create')
    setThreadId(res.threadId)
  }

  async function sendMessage(
    message: string,
    callback?: (res: ThredMessage[]) => void,
  ) {
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
      if (res.completed) {
        setLoading(false)
        if (callbackRef.current) {
          callbackRef.current(res.messages)
          callbackRef.current = undefined
        }
      } else {
        // Manejo del caso cuando se alcanza el número máximo de intentos
        message.error('Max attempts reached, stopping recursion')
        setLoading(false)
      }
    }
  }

  async function deleteChat() {
    await query('openAI/delete', { threadId })
    removeThreadId()
  }

  return (
    <ChatContext.Provider
      value={{
        createThread,
        threadId,
        loading,
        sendMessage,
        getMessages,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
