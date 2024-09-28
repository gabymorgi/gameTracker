import SpoilerStatistic from '../SpoilerStatistic'
import { Word } from '@/ts/api/words'
import FormatedDefinition from '@/components/ui/FormattedDefinition'

interface WordCardProps {
  memo: Word
}

function WordCard(props: WordCardProps) {
  return (
    <SpoilerStatistic
      title={props.memo.value}
      value={<FormatedDefinition definition={props.memo.definition} />}
    />
  )
}

export default WordCard
