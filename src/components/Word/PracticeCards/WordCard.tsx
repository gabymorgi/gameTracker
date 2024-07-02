import { Memo } from '@/ts/books'
import SpoilerStatistic from '../SpoilerStatistic'

interface WordCardProps {
  memo: Memo
}

function WordCard(props: WordCardProps) {
  return (
    <SpoilerStatistic title={props.memo.value} value={props.memo.definition} />
  )
}

export default WordCard
