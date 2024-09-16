import SpoilerStatistic from '../SpoilerStatistic'
import { Word } from '@/ts/api/words'

interface WordCardProps {
  memo: Word
}

function WordCard(props: WordCardProps) {
  return (
    <SpoilerStatistic title={props.memo.value} value={props.memo.definition} />
  )
}

export default WordCard
