import { Memo } from '@/ts/books'
import SpoilerStatistic from '../SpoilerStatistic'
import React from 'react'

interface WordCardProps {
  memo: Memo
}

function WordCard(props: WordCardProps) {
  return (
    <React.Fragment key={props.memo.id}>
      <SpoilerStatistic
        title={props.memo.word || '-'}
        value={props.memo.definition || '-'}
      />
    </React.Fragment>
  )
}

export default WordCard
