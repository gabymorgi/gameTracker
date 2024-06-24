import { DatePicker as AntDatePicker } from 'antd'
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns'

const DatePicker = AntDatePicker.generatePicker<Date>(dateFnsGenerateConfig)

export default DatePicker
