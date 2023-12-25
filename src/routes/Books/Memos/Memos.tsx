import { Col, Row } from 'antd'

import WordForm from './WordForm'
import PhraseList from './PhraseList'
import MemoForm from './MemoForm'
import MemoList from './MemoList'
import { ChatProvider } from '@/contexts/ChatContext'

function Memos() {
  return (
    <ChatProvider>
      <div className="flex flex-col gap-16">
        <MemoForm />
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <PhraseList />
            <WordForm />
          </Col>
          <Col span={12}>
            <MemoList />
          </Col>
        </Row>
      </div>
    </ChatProvider>
  )
}

export default Memos
