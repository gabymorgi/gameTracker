import { InputNumber } from 'antd'

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
    <div className="flex gap-16 items-center">
      <InputNumber
        value={props.value ? props.value.obtained : 0}
        onChange={(value) =>
          props.onChange?.({
            obtained: value || 0,
            total: props.value?.total || 0,
          })
        }
      />
      <InputNumber
        value={props.value ? props.value.total : 0}
        onChange={(value) =>
          props.onChange?.({
            obtained: props.value?.obtained || 0,
            total: value || 0,
          })
        }
      />
    </div>
  )
}
