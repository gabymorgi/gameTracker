import { createContext, useRef, useState } from 'react'
import { Options, query } from '../hooks/useFetch'
import { EndPoint } from '@/ts'
import useLocalStorage from '@/hooks/useLocalStorage'
import OpenAI from 'openai'

export type ThredMessage = Omit<
  OpenAI.Beta.Threads.Messages.ThreadMessage,
  'content'
> & {
  content: Array<OpenAI.Beta.Threads.Messages.MessageContentText>
}

interface GetResponse {
  completed: boolean
  runId: string
  messages: ThredMessage[]
}

interface PostResponse {
  run: OpenAI.Beta.Threads.Runs.Run
  message: ThredMessage
  threadId: string
  completed: boolean
}

interface ChatStorage {
  runId?: string
  threadId?: string
}

interface IChatContext {
  loading: boolean
  messages: ThredMessage[]
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
  const [messages, setMessages] = useState<ThredMessage[]>([])
  const [chatData, setChatData] = useLocalStorage<ChatStorage>('chatData', {})
  const callbackRef = useRef<(res: ThredMessage[]) => void>()

  async function sendMessage(
    message: string,
    callback?: (res: ThredMessage[]) => void,
  ) {
    setLoading(true)
    const res = await query<PostResponse>(
      EndPoint.OPEN_AI,
      Options.POST,
      undefined,
      {
        threadId: chatData.threadId,
        message,
      },
    )
    setChatData({
      runId: res.run.id,
      threadId: res.threadId,
    })
    callbackRef.current = callback
    setTimeout(() => {
      getMessages({
        runId: res.run.id,
        threadId: res.threadId,
      })
    }, 3000)
  }

  async function getMessages(data?: ChatStorage) {
    setLoading(true)
    const res = await query<GetResponse>(
      EndPoint.OPEN_AI,
      Options.GET,
      data || chatData,
    )
    if (!res.completed) {
      setTimeout(() => {
        getMessages(data)
      }, 3000)
    } else {
      setChatData({
        threadId: chatData.threadId,
      })
      setMessages(res.messages)
      setLoading(false)
      if (callbackRef.current) {
        callbackRef.current(res.messages)
        callbackRef.current = undefined
      }
    }
  }

  async function deleteChat() {
    await query(EndPoint.OPEN_AI, Options.DELETE, chatData)
    setChatData({})
  }

  return (
    <ChatContext.Provider
      value={{
        loading,
        messages,
        sendMessage,
        getMessages,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
