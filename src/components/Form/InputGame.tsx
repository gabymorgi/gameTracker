import { MinusCircleFilled, PlusCircleFilled } from '@ant-design/icons'
import {
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
import DatePicker from '@/components/ui/DatePicker'
import { InputHours } from '@/components/Form/InputHours'
import { InputAchievements, InputAchievementsValue } from './InputAchievements'
import { NamePath } from 'antd/es/form/interface'
import { GlobalContext } from '@/contexts/GlobalContext'
import { getImgUrl } from '@/utils/steam'
import { formattedPathName } from '@/utils/format'
import { InputState } from './InputState'
import { InputChangelog } from './InputChangelog'
import { defaultNewChangelog } from '@/utils/defaultValue'
import { GameState, GameWithChangelogs, platform } from '@/ts/api/games'

interface InputGameProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: GameWithChangelogs
  onChange?: (value: GameWithChangelogs) => void
  ban?: (appid: number) => void
  remove?: () => void
  fieldName?: NamePath
}

export function InputGame(props: InputGameProps) {
  // const { notification } = App.useApp()
  const { tags } = useContext(GlobalContext)

  const handleSetAppid = (appid: number | null) => {
    //set value on imageUrl on the index of the form
    props.onChange?.({
      ...props.value!,
      appid: appid,
      imageUrl: appid ? getImgUrl(appid) : '',
    })
  }

  const handleSetHours = (hours: number | null) => {
    const changelogs = props.value!.changelogs || []
    const lastChangelog = changelogs[changelogs.length - 1]
    if (lastChangelog) {
      const diff = (hours || 0) - props.value!.playedTime
      lastChangelog.hours += diff
    }
    props.onChange?.({
      ...props.value!,
      playedTime: hours || 0,
      changelogs: [...changelogs],
    })
  }

  const handleSetAchievements = (value: InputAchievementsValue) => {
    const changelogs = props.value!.changelogs || []
    const lastChangelog = changelogs[changelogs.length - 1]
    if (lastChangelog) {
      const diff = value.obtained - (props.value!.achievements.obtained || 0)
      lastChangelog.achievements += diff
    }
    props.onChange?.({
      ...props.value!,
      achievements: value,
      changelogs: [...changelogs],
    })
  }

  const handleSetState = (value: GameState) => {
    const changelogs = props.value!.changelogs || []
    const lastChangelog = changelogs[changelogs.length - 1]
    if (lastChangelog) {
      lastChangelog.state = value
    }
    props.onChange?.({
      ...props.value!,
      state: value,
      changelogs: [...changelogs],
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
    <Card
      size="small"
      actions={
        props.ban || props.remove
          ? [
              props.ban ? (
                <Button
                  danger
                  type="primary"
                  onClick={() => {
                    props.ban?.(props.value?.appid || 0)
                    props.remove?.()
                  }}
                  icon={<MinusCircleFilled />}
                >
                  Ban game
                </Button>
              ) : null,
              props.remove ? (
                <Button
                  danger
                  type="default"
                  onClick={props.remove}
                  icon={<MinusCircleFilled />}
                >
                  Remove game
                </Button>
              ) : null,
            ]
          : undefined
      }
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={8} md={7} lg={6} xl={6}>
          <Form.Item name={[...fieldNames, 'imageUrl']}>
            <FakeInputImage />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={7} lg={6} xl={6}>
          <Form.Item
            name={[...fieldNames, 'name']}
            label="Name"
            rules={[{ required: true }]}
          >
            <Input size="middle" type="text" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={7} lg={6} xl={6}>
          <Form.Item label="Image URL" name={[...fieldNames, 'imageUrl']}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={3} lg={3} xl={3}>
          <Form.Item
            label="Platform"
            name={[...fieldNames, 'platform']}
            rules={[{ required: true }]}
          >
            <Select allowClear>
              {Object.keys(platform).map((key) => (
                <Select.Option key={key} value={key}>
                  {key}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xl={3}>
          <Form.Item label="App ID" name={[...fieldNames, 'appid']}>
            <InputNumber min={0} onChange={handleSetAppid} className="w-full" />
          </Form.Item>
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
        <Col xs={12} sm={6} md={5} lg={6} xl={3}>
          <Form.Item label="Hours" name={[...fieldNames, 'playedTime']}>
            <InputHours onChange={handleSetHours} />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={5} lg={6} xl={3}>
          <Form.Item
            label="Extra Hours"
            name={[...fieldNames, 'extraPlayedTime']}
          >
            <InputHours />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4} lg={6} xl={3} xxl={2}>
          <Form.Item
            name={[...fieldNames, 'state']}
            label="State"
            rules={[{ required: true }]}
          >
            <InputState allowClear onChange={handleSetState} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={10} lg={9} xl={4} xxl={6}>
          <Form.Item
            name={[...fieldNames, 'tags']}
            label="Tags"
            rules={[{ required: true }]}
          >
            <Select mode="tags" allowClear>
              {tags &&
                Object.keys(tags)
                  .sort()
                  .map((key) => (
                    <Select.Option key={key} value={key}>
                      {key}
                    </Select.Option>
                  ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} xl={3} xxl={2}>
          <Form.Item
            name={[...fieldNames, 'achievements']}
            label="Achievements"
          >
            <InputAchievements onChange={handleSetAchievements} />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={2}>
          <Form.Item label="Mark" name={[...fieldNames, 'mark']}>
            <InputNumber min={-1} max={10} className="w-full" />
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
        <Col span={24}>
          <Card title="Changelogs" size="small">
            <Form.List name={[...fieldNames, 'changelogs']}>
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Form.Item name={name} key={key} className="no-margin">
                      <InputChangelog
                        fieldName={name}
                        remove={() => remove(name)}
                      />
                    </Form.Item>
                  ))}
                  <Form.ErrorList errors={errors} />
                  <Button
                    type="default"
                    onClick={() => add(defaultNewChangelog)}
                    icon={<PlusCircleFilled />}
                  >
                    Add changelog
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
