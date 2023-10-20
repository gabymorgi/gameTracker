import { Col, Row } from "antd";

import WordList from "./WordList";
import PhraseList from "./PhraseList";
import MemoForm from "./MemoForm";

function Memos() {

  return (
    <div className="flex flex-col gap-16">
      <MemoForm />
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <WordList />
        </Col>
        <Col span={8}>
          <PhraseList />
        </Col>
      </Row>
    </div>
  );
}

export default Memos;
