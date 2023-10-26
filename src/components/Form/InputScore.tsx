import { ScoreI } from '@/ts/index'
import { MinusCircleFilled, PlusCircleFilled } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, InputProps, Row } from 'antd'
import { InputCustomScore } from './InputCustomScore'
import { NamePath } from 'antd/es/form/interface'
import { formattedPathName } from '@/utils/format'

const scoreFields = [
  'content',
  'lore',
  'mechanics',
  'bosses',
  'controls',
  'music',
  'graphics',
]

interface InputScoreProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: ScoreI
  onChange?: (value?: ScoreI) => void
  fieldName?: NamePath
}

export function InputScore(props: InputScoreProps) {
  const fieldNames = formattedPathName(props.fieldName)

  const showScore = () => {
    props.onChange?.({} as ScoreI)
  }

  const hideScore = () => {
    props.onChange?.()
  }

  return props.value ? (
    <Card>
      <Row gutter={16}>
        {scoreFields.map((field) => (
          <Col sm={6} lg={3} key={field}>
            <Form.Item name={[...fieldNames, field]} label={field}>
              <Input type="number" min={0} max={10} />
            </Form.Item>
          </Col>
        ))}
        <Col sm={6} lg={3}>
          <Form.Item
            name={[...fieldNames, 'finalMark']}
            label="finalMark"
            rules={[{ required: true }]}
          >
            <Input type="number" min={0} max={10} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.List name={[...fieldNames, 'extra']}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Row gutter={16} key={key}>
                    <Col flex="auto">
                      <Form.Item name={name}>
                        <InputCustomScore fieldName={name} />
                      </Form.Item>
                    </Col>
                    <Col flex="none">
                      <Button
                        danger
                        type="default"
                        onClick={() => remove(name)}
                        icon={<MinusCircleFilled />}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.ErrorList errors={errors} />
                <Form.Item>
                  <Button
                    type="default"
                    onClick={() => add()}
                    icon={<PlusCircleFilled />}
                  >
                    Add extra information
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
        <Col span={24} className="flex justify-end">
          <Button danger onClick={hideScore}>
            Remove Score
          </Button>
        </Col>
      </Row>
    </Card>
  ) : (
    <Button onClick={showScore}>Add Score</Button>
  )
}
