import { Memo } from '@/ts/books'
import React, { useMemo } from 'react'
import SpoilerStatistic from '../SpoilerStatistic'

interface TranslationCardProps {
  memo: Memo
}

function TranslationCard(props: TranslationCardProps) {
  const randomPhrase = useMemo(() => {
    return props.memo.phrases[
      Math.floor(Math.random() * props.memo.phrases.length)
    ]
  }, [props.memo.phrases])

  return (
    <React.Fragment key={props.memo.id}>
      <SpoilerStatistic
        title={props.memo.definition || '-'}
        value={props.memo.word || '-'}
      />
      <SpoilerStatistic
        title={randomPhrase?.translation || '-'}
        value={randomPhrase?.content || '-'}
      />
    </React.Fragment>
  )
}

export default TranslationCard
