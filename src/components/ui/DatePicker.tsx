import { DatePicker as AntDatePicker } from 'antd'
import dateFnsGenerateConfig from '@rc-component/picker/generate/dateFns'

const DatePicker = AntDatePicker.generatePicker<Date>(dateFnsGenerateConfig)

export default DatePicker
