import { GenerateConfig } from 'rc-picker/lib/generate'
import {
  addDays,
  addMonths,
  addYears,
  endOfMonth,
  format as formatDate,
  getDate,
  getDay,
  getHours,
  getMinutes,
  getMonth,
  getSeconds,
  getWeek,
  getYear,
  isValid,
  parse as parseDate,
  setDate,
  setHours,
  setMinutes,
  setMonth,
  setSeconds,
  setYear,
  startOfWeek,
  startOfYear,
} from 'date-fns'

const localeParse = (format: string) => {
  return format
    .replace(/Y/g, 'y')
    .replace(/D/g, 'd')
    .replace(/gggg/, 'yyyy')
    .replace(/g/g, 'G')
    .replace(/([Ww])o/g, 'wo')
}

const firstDOW = startOfWeek(Date.now())
const firstDOY = startOfYear(Date.now())
const shortWeekDaysArray = Array.from(Array(7)).map((_e, i) =>
  formatDate(addDays(firstDOW, i), 'EEEEEE'),
)
const shortMonthsArray = Array.from(Array(12)).map((_d, i) =>
  formatDate(addMonths(firstDOY, i), 'MMM'),
)

const generateConfig: GenerateConfig<number> = {
  // get
  getNow: () => Date.now() / 1000,
  getFixedDate: (string: string | number) => new Date(string).getTime() / 1000,
  getEndDate: (date: number) => endOfMonth(date).getTime() / 1000,
  getWeekDay: (date) => getDay(date * 1000),
  getYear: (date) => getYear(date * 1000),
  getMonth: (date) => getMonth(date * 1000),
  getDate: (date) => getDate(date * 1000),
  getHour: (date) => getHours(date * 1000),
  getMinute: (date) => getMinutes(date * 1000),
  getSecond: (date) => getSeconds(date * 1000),

  // set
  addYear: (date, diff) => addYears(date * 1000, diff).getTime() / 1000,
  addMonth: (date, diff) => addMonths(date * 1000, diff).getTime() / 1000,
  addDate: (date, diff) => addDays(date * 1000, diff).getTime() / 1000,
  setYear: (date, year) => setYear(date * 1000, year).getTime() / 1000,
  setMonth: (date, month) => setMonth(date * 1000, month).getTime() / 1000,
  setDate: (date, num) => setDate(date * 1000, num).getTime() / 1000,
  setHour: (date, hour) => setHours(date * 1000, hour).getTime() / 1000,
  setMinute: (date, minute) => setMinutes(date * 1000, minute).getTime() / 1000,
  setSecond: (date, second) => setSeconds(date * 1000, second).getTime() / 1000,

  // Compare
  isAfter: (date1, date2) => date1 > date2,
  isValidate: (date) => !isNaN(date) && date > 0,

  locale: {
    getWeekFirstDay: () => {
      return 0
    },
    getWeekFirstDate: (_, date: number) => {
      const weekStart = new Date(date * 1000);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return weekStart.getTime() / 1000;
    },
    getShortWeekDays: () => {
      return shortWeekDaysArray
    },
    getShortMonths: () => {
      return shortMonthsArray
    },
    getWeek: (_, date) => {
      return getWeek(date * 1000)
    },
    format: (_, date, format) => {
      if (isNaN(date) || date < 0) {
        return 'Invalid date'
      }
      return formatDate(date * 1000, localeParse(format))
    },
    parse: (_locale, text, formats) => {
      for (let i = 0; i < formats.length; i += 1) {
        const format = localeParse(formats[i])
        const formatText = text
        const date = parseDate(formatText, format, new Date())
        if (isValid(date)) {
          return date.getTime() / 1000
        }
      }
      return null
    },
  },
}

export default generateConfig