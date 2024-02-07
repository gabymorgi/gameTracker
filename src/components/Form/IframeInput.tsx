import { mdiOpenInNew } from '@mdi/js'
import Icon from '@mdi/react'
import { Col, Row } from 'antd'
import TextArea from 'antd/es/input/TextArea'

interface IframeInputProps {
  onTextReceived: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  url: string
  text: string
}

const IframeInput: React.FC<IframeInputProps> = (props) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <div className="flex items-center justify-between gap-16">
          <a
            href={props.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center"
          >
            {props.text}&nbsp;
            <Icon path={mdiOpenInNew} title="get steam data" size="14px" />
          </a>
          <span>Copy the json data from the steam page and paste it below</span>
        </div>
      </Col>
      <Col span={12}>
        <iframe title="steam data" src={props.url} className="w-full" />
      </Col>
      <Col span={12}>
        <TextArea
          style={{ height: '100%' }}
          placeholder="paste steam json data"
          onChange={props.onTextReceived}
        />
      </Col>
    </Row>
  )
}

export default IframeInput
