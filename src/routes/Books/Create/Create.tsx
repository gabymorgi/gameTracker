import WordForm from './WordForm'
import PhraseList from './PhraseList'
import { ChatProvider } from '@/contexts/ChatContext'

function CreateMemo() {
  return (
    <ChatProvider>
      <div className="flex flex-col gap-16">
        <WordForm />
        <PhraseList />
      </div>
    </ChatProvider>
  )
}

export default CreateMemo
