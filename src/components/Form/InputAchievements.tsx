import { InputNumber } from 'antd'

interface InputAchievementsPropsI {
  value?: [number, number]
  onChange?: (value: [number, number]) => void
}

export function InputAchievements(props: InputAchievementsPropsI) {
  return (
    <div className="flex gap-16 items-center">
      <InputNumber
        value={props.value ? props.value[0] : 0}
        onChange={(value) =>
          props.onChange?.([value || 0, props.value?.[1] || 0])
        }
      />
      <InputNumber
        value={props.value ? props.value[1] : 0}
        onChange={(value) =>
          props.onChange?.([props.value?.[0] || 0, value || 0])
        }
      />
    </div>
  )
}
