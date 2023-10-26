import generatePicker, {
  PickerProps,
  RangePickerProps,
} from 'antd/es/date-picker/generatePicker'
import dateFnsGenerateConfig from './DatePicker.config'
import React from 'react'

const AntDatePicker = generatePicker<number>(dateFnsGenerateConfig)

export const DatePicker: React.FC<PickerProps<number>> = (props) => {
  return <AntDatePicker {...props} />
}

export const RangePicker: React.FC<RangePickerProps<number>> = (props) => {
  return <AntDatePicker.RangePicker {...props} />
}
