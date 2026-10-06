import { LinkOutlined } from '@ant-design/icons'
import {
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  InputProps,
  Row,
  Select,
} from 'antd'
import { useCallback, useContext } from 'react'
import { FakeInputImage } from './FakeInputImage'
import DatePicker from '@/components/ui/DatePicker'
import { NamePath } from 'antd/es/form/interface'
import { GlobalContext } from '@/contexts/GlobalContext'
import { formattedPathName } from '@/utils/format'
import { InputState } from './InputState'
import { PrismaGameWithChangelogs } from '@/ts/api/games'
import { $Enums } from '#prisma-browser-client'

interface InputGameProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: PrismaGameWithChangelogs
  onChange?: (value: PrismaGameWithChangelogs) => void
  fieldName?: NamePath
}

export function InputGame(props: InputGameProps) {
  const { tags } = useContext(GlobalContext)

  const handleSetAppid = (appid: number | null) => {
    //set value on imageUrl on the index of the form
    props.onChange?.({
      ...props.value!,
      appid: appid,
      imageUrl: appid
        ? `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`
        : '',
    })
  }

  const disabledStartDate = useCallback(
    (current: Date) => {
      return current > (props.value?.end || Infinity)
    },
    [props.value?.end],
  )

  const disabledEndDate = useCallback(
    (current: Date) => {
      return current < (props.value?.start || 0)
    },
    [props.value?.start],
  )

  const fieldNames = formattedPathName(props.fieldName)

  return (
    <Card size="small">
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12} md={8} xl={6}>
          <Form.Item name={[...fieldNames, 'imageUrl']}>
            <FakeInputImage />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={16} xl={18}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={[...fieldNames, 'name']}
                label="Name"
                rules={[{ required: true }]}
              >
                <Input size="middle" type="text" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span>
                    Image URL{' '}
                    {props.value?.appid ? (
                      <a
                        href={`https://store.steampowered.com/app/${props.value.appid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open image in new tab"
                      >
                        <LinkOutlined />
                      </a>
                    ) : null}
                  </span>
                }
                name={[...fieldNames, 'imageUrl']}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="OST" name={[...fieldNames, 'ost']}>
                <Input type="url" placeholder="OST link" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                label="Platform"
                name={[...fieldNames, 'platform']}
                rules={[{ required: true }]}
              >
                <Select
                  allowClear
                  options={Object.keys($Enums.Platform).map((key) => ({
                    label: key,
                    value: key,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item label="App ID" name={[...fieldNames, 'appid']}>
                <InputNumber
                  min={0}
                  onChange={handleSetAppid}
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col xs={12} sm={6} md={5} lg={6} xl={3}>
          <Form.Item
            label="Start"
            name={[...fieldNames, 'start']}
            rules={[{ required: true }]}
          >
            <DatePicker disabledDate={disabledStartDate} />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={5} lg={6} xl={3}>
          <Form.Item
            label="End"
            name={[...fieldNames, 'end']}
            rules={[{ required: true }]}
          >
            <DatePicker disabledDate={disabledEndDate} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4} lg={6} xl={3} xxl={2}>
          <Form.Item
            name={[...fieldNames, 'state']}
            label="State"
            rules={[{ required: true }]}
          >
            <InputState allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={10} lg={9} xl={4} xxl={6}>
          <Form.Item
            name={[...fieldNames, 'tags']}
            label="Tags"
            rules={[{ required: true }]}
          >
            <Select
              mode="tags"
              allowClear
              options={
                tags
                  ? Object.keys(tags)
                      .sort()
                      .map((key) => ({ value: key, label: key }))
                  : []
              }
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} xl={3} xxl={2}>
          <Form.Item
            label="Total Achievements"
            name={[...fieldNames, 'totalAchievements']}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Review" name={[...fieldNames, 'review']}>
            <Input.TextArea
              autoSize={{ minRows: 3 }}
              placeholder="Game Review"
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  )
}
