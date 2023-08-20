import { MinusCircleFilled } from '@ant-design/icons'
import {
  App,
  Button,
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
import { DatePicker } from '@/components/ui/DatePicker'
import { InputHours } from '@/components/Form/InputHours'
import { FakeInputIFrame } from './FakeInputIFrame'
import { InputAchievements } from './InputAchievements'
import { InputScore } from './InputScore'
import { FormGameI } from '@/ts/index'
import { NamePath } from 'antd/es/form/interface'
import { GlobalContext } from '@/contexts/GlobalContext'
import { getImgUrl, steamApiGameAchievementsI } from '@/back/steamApi'
import { formatPlayedTime, formattedPathName } from '@/utils/format'

enum Platform {
  NES = 'NES',
  SEGA = 'SEGA',
  PS1 = 'PS1',
  PS2 = 'PS2',
  SNES = 'SNES',
  PC = 'PC',
  NDS = 'NDS',
  GBA = 'GBA',
  WII = 'WII',
  ANDROID = 'ANDROID',
  FLASH = 'FLASH',
}

interface InputGameProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: FormGameI
  onChange?: (value: FormGameI) => void
  remove?: () => void
  fieldName?: NamePath
}

export function InputGame(props: InputGameProps) {
  const { notification } = App.useApp();
  const { tags, states } = useContext(GlobalContext)

  const handleSetAppid = (appid: number | null) => {
    //set value on imageUrl on the index of the form
    props.onChange?.({
      ...(props.value as FormGameI),
      appid: appid || undefined,
      imageUrl: appid ? getImgUrl(appid) : undefined,
    })
  }

  function parseSteamAchievementsData(e: React.ChangeEvent<HTMLTextAreaElement>) {
    try {
      const { playerstats } = JSON.parse(e.target.value) as steamApiGameAchievementsI
      const obtainedAchievements = playerstats.achievements.filter(
        (a) => a.achieved
      ).length
      props.onChange?.({
        ...(props.value as FormGameI),
        achievements: [obtainedAchievements, playerstats.achievements.length],
        name: playerstats.gameName,
      })
    } catch (e: any) {
      notification.error({
        message: 'Error parsing data',
        description: e.message,
      })
    }
  }

  const disabledStartDate = useCallback(
    (current: number) => {
      return (current || 0) > (props.value?.end || Infinity)
    },
    [props.value?.end]
  )

  const disabledEndDate = useCallback(
    (current: number) => {
      return (current || 0) < (props.value?.start || 0)
    },
    [props.value?.start]
  )

  const fieldNames = formattedPathName(props.fieldName)

  return (
    <Card>
      <Row gutter={[16, 0]}>
        <Col xs={24} lg={5}>
          <Form.Item name={[...fieldNames, 'imageUrl']}>
            <FakeInputImage />
          </Form.Item>
        </Col>
        <Col xs={24} lg={4}>
          <Form.Item label='App ID' name={[...fieldNames, 'appid']}>
            <InputNumber min={0} onChange={(value) => handleSetAppid(value)} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={5}>
          <Form.Item label='Image URL' name={[...fieldNames, 'imageUrl']}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} lg={5}>
          <Form.Item label="Platform" name={[...fieldNames, 'platform']} rules={[{ required: true }]}>
            <Select allowClear>
              {Object.keys(Platform).map((key) => (
                <Select.Option key={key} value={key}>
                  {key}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} lg={5}>
          <Form.Item
            name={[...fieldNames, 'name']}
            label='Name'
            rules={[{ required: true }]}
          >
            <Input size='middle' type='text' />
          </Form.Item>
        </Col>
        <Col xs={24} lg={6}>
          <Form.Item
            label='Start'
            name={[...fieldNames, 'start']}
            rules={[{ required: true }]}
          >
            <DatePicker disabledDate={disabledStartDate} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={6}>
          <Form.Item
            label='End'
            name={[...fieldNames, 'end']}
            rules={[{ required: true }]}
          >
            <DatePicker disabledDate={disabledEndDate} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={6}>
          <Form.Item label={`Hours ${props.value?.oldHours ? formatPlayedTime(props.value.oldHours) : ''}`} name={[...fieldNames, 'playedTime']}>
            <InputHours />
          </Form.Item>
        </Col>
        <Col xs={24} lg={6}>
          <Form.Item label='Extra Hours' name={[...fieldNames, 'extraPlayedTime']}>
            <InputHours />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name={[...fieldNames, 'appid']}>
            <FakeInputIFrame onTextReceived={(e) => parseSteamAchievementsData(e)} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={[...fieldNames, 'achievements']} label='Achievements'>
            <InputAchievements />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item
            name={[...fieldNames, 'state']}
            label='State'
            rules={[{ required: true }]}
          >
            <Select allowClear>
              {states &&
                Object.keys(states).map((key) => (
                  <Select.Option key={key} value={key}>
                    {key}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={[...fieldNames, 'tags']}
            label='Tags'
            rules={[{ required: true }]}
          >
            <Select mode='tags' allowClear>
              {tags &&
                Object.keys(tags).map((key) => (
                  <Select.Option key={key} value={key}>
                    {key}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name={[...fieldNames, 'score']} label='Score'>
            <InputScore fieldName={[...fieldNames, 'score']} />
          </Form.Item>
        </Col>
        {props.remove ? (
          <Col span={24} className='flex justify-end'>
            <Button
              danger
              type='default'
              onClick={() => props.remove?.()}
              icon={<MinusCircleFilled />}
            >
              Remove game
            </Button>
          </Col>
        ) : null}
      </Row>
    </Card>
  )
}
