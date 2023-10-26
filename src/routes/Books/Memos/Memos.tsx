import { Col, Row } from 'antd'

import WordForm from './WordForm'
import PhraseList from './PhraseList'
import MemoForm from './MemoForm'

function Memos() {
  return (
    <div className="flex flex-col gap-16">
      <MemoForm />
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <WordForm />
        </Col>
        <Col span={8}>
          <PhraseList />
        </Col>
      </Row>
    </div>
  )
}

export default Memos
