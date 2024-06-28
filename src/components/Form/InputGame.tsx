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
// import { FakeInputIFrame } from './FakeInputIFrame'
import { InputAchievements, InputAchievementsValue } from './InputAchievements'
import { InputScore } from './InputScore'
import { NamePath } from 'antd/es/form/interface'
import { GlobalContext } from '@/contexts/GlobalContext'
import { getImgUrl } from '@/utils/steam'
import { formattedPathName } from '@/utils/format'
import { InputState } from './InputState'
import { InputChangelog } from './InputChangelog'
import { GameI } from '@/ts/game'
import { defaultNewChangelog } from '@/utils/defaultValue'

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
  value?: GameI
  onChange?: (value: GameI) => void
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
      appid: appid || undefined,
      imageUrl: appid ? getImgUrl(appid) : undefined,
    })
  }

  const handleSetHours = (hours: number | null) => {
    const changelogs = props.value!.changeLogs || []
    const lastChangelog = changelogs[changelogs.length - 1]
    if (lastChangelog) {
      const diff = (hours || 0) - props.value!.playedTime
      lastChangelog.hours += diff
    }
    props.onChange?.({
      ...props.value!,
      playedTime: hours || 0,
      changeLogs: [...changelogs],
    })
  }

  const handleSetAchievements = (value: InputAchievementsValue) => {
    const changelogs = props.value!.changeLogs || []
    const lastChangelog = changelogs[changelogs.length - 1]
    if (lastChangelog) {
      const diff = value.obtained - (props.value!.achievements.obtained || 0)
      lastChangelog.achievements += diff
    }
    props.onChange?.({
      ...props.value!,
      achievements: value,
      changeLogs: [...changelogs],
    })
  }

  const handleSetState = (value: string) => {
    const changelogs = props.value!.changeLogs || []
    const lastChangelog = changelogs[changelogs.length - 1]
    if (lastChangelog) {
      lastChangelog.stateId = value
    }
    props.onChange?.({
      ...props.value!,
      stateId: value,
      changeLogs: [...changelogs],
    })
  }

  // function parseSteamAchievementsData(
  //   e: React.ChangeEvent<HTMLTextAreaElement>,
  // ) {
  //   try {
  //     const { playerstats } = JSON.parse(
  //       e.target.value,
  //     ) as steamApiGameAchievementsI
  //     const obtainedAchievements = playerstats.achievements.filter(
  //       (a) => a.achieved,
  //     ).length
  //     props.onChange?.({
  //       ...props.value!,
  //       achievements: {
  //         obtained: obtainedAchievements,
  //         total: playerstats.achievements.length,
  //       },
  //       // name: playerstats.gameName,
  //     })
  //   } catch (e: unknown) {
  //     if (e instanceof Error) {
  //       notification.error({
  //         message: 'Error parsing data',
  //         description: e.message,
  //       })
  //     }
  //   }
  // }

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
      actions={[
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
      ]}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} lg={6}>
          <Form.Item name={[...fieldNames, 'imageUrl']}>
            <FakeInputImage />
          </Form.Item>
        </Col>
        <Col xs={24} lg={6}>
          <Form.Item
            name={[...fieldNames, 'name']}
            label="Name"
            rules={[{ required: true }]}
          >
            <Input size="middle" type="text" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={3}>
          <Form.Item
            label="Platform"
            name={[...fieldNames, 'platform']}
            rules={[{ required: true }]}
          >
            <Select allowClear>
              {Object.keys(Platform).map((key) => (
                <Select.Option key={key} value={key}>
                  {key}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} lg={3}>
          <Form.Item label="App ID" name={[...fieldNames, 'appid']}>
            <InputNumber min={0} onChange={handleSetAppid} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={6}>
          <Form.Item label="Image URL" name={[...fieldNames, 'imageUrl']}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} lg={6}>
          <Form.Item
            label="Start"
            name={[...fieldNames, 'start']}
            rules={[{ required: true }]}
          >
            <DatePicker disabledDate={disabledStartDate} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={6}>
          <Form.Item
            label="End"
            name={[...fieldNames, 'end']}
            rules={[{ required: true }]}
          >
            <DatePicker disabledDate={disabledEndDate} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={6}>
          <Form.Item label="Hours" name={[...fieldNames, 'playedTime']}>
            <InputHours onChange={handleSetHours} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={6}>
          <Form.Item
            label="Extra Hours"
            name={[...fieldNames, 'extraPlayedTime']}
          >
            <InputHours />
          </Form.Item>
        </Col>
        {/* <Col span={24}>
          <Form.Item name={[...fieldNames, 'appid']}>
            <FakeInputIFrame
              onTextReceived={(e) => parseSteamAchievementsData(e)}
            />
          </Form.Item>
        </Col> */}
        <Col span={6}>
          <Form.Item
            name={[...fieldNames, 'achievements']}
            label="Achievements"
          >
            <InputAchievements onChange={handleSetAchievements} />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item
            name={[...fieldNames, 'stateId']}
            label="State"
            rules={[{ required: true }]}
          >
            <InputState allowClear onChange={handleSetState} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={[...fieldNames, 'tags']}
            label="Tags"
            rules={[{ required: true }]}
          >
            <Select mode="tags" allowClear>
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
          <Form.Item name={[...fieldNames, 'score']} label="Score">
            <InputScore fieldName={[...fieldNames, 'score']} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Card title="Changelogs">
            <Form.List name={[...fieldNames, 'changeLogs']}>
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Form.Item name={name} key={key}>
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
