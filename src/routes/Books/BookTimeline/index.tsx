import { Flex } from 'antd'
import { BookFilters } from '@/components/Filters/BookFilters'
import { BookStatistics } from './BookStatistics'
import BookTable from './BookTable'

const BookTimeline = () => {
  return (
    <Flex vertical gap="middle">
      <BookStatistics />
      <BookFilters hideSort />
      <BookTable />
    </Flex>
  )
}

export default BookTimeline
