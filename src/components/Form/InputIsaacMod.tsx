import { PlusCircleFilled } from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  InputProps,
  Row,
} from 'antd'
import DatePicker from '@/components/ui/DatePicker'
import { NamePath } from 'antd/es/form/interface'
import { formattedPathName } from '@/utils/format'
import { defaultPlayableContent } from '@/utils/defaultValue'
import { InputPlayableContent } from './InputPlayableContent'
import { IsaacMod } from '@/ts/api/isaac-mods'

interface InputIsaacModProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: IsaacMod
  onChange?: (value: IsaacMod) => void
  ban?: (appid: number) => void
  remove?: () => void
  fieldName?: NamePath
}

export function InputIsaacMod(props: InputIsaacModProps) {
  const fieldNames = formattedPathName(props.fieldName)

  return (
    <Card size="small">
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12} lg={3}>
          <Form.Item
            name={[...fieldNames, 'name']}
            label="Name"
            rules={[{ required: true }]}
          >
            <Input size="middle" type="text" />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Form.Item label="App ID" name={[...fieldNames, 'appid']}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Form.Item name={[...fieldNames, 'wiki']} label="Wiki">
            <Input size="middle" type="text" />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} lg={3}>
          <Form.Item label="Played At" name={[...fieldNames, 'playedAt']}>
            <DatePicker />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Form.Item label="Items" name={[...fieldNames, 'items']}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Form.Item
            label="Enemies"
            name={[...fieldNames, 'isEnemies']}
            valuePropName="checked"
            layout="horizontal"
          >
            <Checkbox />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <Form.Item
            label="QoL"
            name={[...fieldNames, 'isQoL']}
            valuePropName="checked"
            layout="horizontal"
          >
            <Checkbox />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Extra" name={[...fieldNames, 'extra']}>
            <Input.TextArea
              autoSize={{ minRows: 3 }}
              placeholder="commands, etc."
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Card title="Playable Contents" size="small">
            <Form.List name={[...fieldNames, 'playableContents']}>
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Form.Item name={name} key={key}>
                      <InputPlayableContent
                        fieldName={name}
                        remove={() => remove(name)}
                      />
                    </Form.Item>
                  ))}
                  <Form.ErrorList errors={errors} />
                  <Button
                    type="default"
                    onClick={() => add(defaultPlayableContent)}
                    icon={<PlusCircleFilled />}
                  >
                    Add Playable Content
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Col>
      </Row>
    </Card>
  )
}
