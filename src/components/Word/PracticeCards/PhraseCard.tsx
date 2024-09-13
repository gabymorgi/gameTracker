import { useMemo } from 'react'
import SpoilerStatistic from '../SpoilerStatistic'
import { Word } from '@/ts/api/words'

interface PhraseCardProps {
  memo: Word
}

function PhraseCard(props: PhraseCardProps) {
  const randomPhrase = useMemo(() => {
    return props.memo.phrases[
      Math.floor(Math.random() * props.memo.phrases.length)
    ]
  }, [props.memo.phrases])

  return (
    <SpoilerStatistic
      title={randomPhrase?.content}
      value={randomPhrase?.translation}
    />
  )
}

export default PhraseCard
