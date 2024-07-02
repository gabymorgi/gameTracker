import { InputNumber } from 'antd'
import { JoinedInput } from './JoinedInput'

export interface InputAchievementsValue {
  obtained: number
  total: number
}

interface InputAchievementsPropsI {
  value?: InputAchievementsValue
  onChange?: (value: InputAchievementsValue) => void
}

export function InputAchievements(props: InputAchievementsPropsI) {
  return (
    <JoinedInput>
      <InputNumber
        className="w-full input-left"
        value={props.value ? props.value.obtained : 0}
        onChange={(value) =>
          props.onChange?.({
            obtained: value || 0,
            total: props.value?.total || 0,
          })
        }
      />
      <span className="divider">/</span>
      <InputNumber
        className="w-full input-right"
        value={props.value ? props.value.total : 0}
        onChange={(value) =>
          props.onChange?.({
            obtained: props.value?.obtained || 0,
            total: value || 0,
          })
        }
      />
    </JoinedInput>
  )
}
