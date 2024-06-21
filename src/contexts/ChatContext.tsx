import { createContext, useRef, useState } from 'react'
import { query } from '../hooks/useFetch'
import OpenAI from 'openai'
import { message } from 'antd'
import { useLocalStorage } from 'usehooks-ts'

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
  chatData: ChatStorage
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
    const res = await query<PostResponse>('openAI', 'POST', {
      threadId: chatData.threadId,
      message,
    })
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

  async function getMessages(data?: ChatStorage, attempt = 0) {
    setLoading(true)
    const res = await query<GetResponse>('openAI', 'GET', data || chatData)

    if (!res.completed && attempt < 10) {
      setTimeout(() => {
        getMessages(data, attempt + 1)
      }, 3000)
    } else {
      if (res.completed) {
        setChatData({
          threadId: chatData.threadId,
        })
        setMessages(res.messages)
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
    await query('openAI', 'DELETE', chatData)
    setChatData({})
  }

  return (
    <ChatContext.Provider
      value={{
        chatData,
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
