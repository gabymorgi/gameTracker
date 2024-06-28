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
  messagesCount: number
  createThread: () => Promise<void>
  getMessages: () => Promise<void>
  sendMessage: (
    message: string,
    callback?: (res: ThredMessage[]) => void,
  ) => Promise<void>
  deleteThread: () => Promise<void>
}

export const ChatContext = createContext<IChatContext>({} as IChatContext)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messagesCount, setMessagesCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [threadId, setThreadId, removeThreadId] = useLocalStorage<string>(
    threadIdKey,
    '',
  )
  const callbackRef = useRef<(res: ThredMessage[]) => void>()

  async function createThread() {
    setLoading(true)
    const res = await query('openAI/create')
    setMessagesCount(0)
    setThreadId(res.threadId)
    setLoading(false)
  }

  async function sendMessage(
    message: string,
    callback?: (res: ThredMessage[]) => void,
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
