import WordForm from './WordForm'
// import PhraseList from './PhraseList'
import { ChatProvider } from '@/contexts/ChatContext'
// import MemoForm from './MemoForm'

function CreateMemo() {
  return (
    <ChatProvider>
      <div className="flex flex-col gap-16">
        <WordForm />
        {/* <hr />
        <WordForm />
        <hr />
        <PhraseList /> */}
        {/* <MemoForm /> */}
      </div>
    </ChatProvider>
  )
}

export default CreateMemo