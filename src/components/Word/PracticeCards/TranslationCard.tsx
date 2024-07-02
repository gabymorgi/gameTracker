import { Memo } from '@/ts/books'
import { useMemo } from 'react'
import SpoilerStatistic from '../SpoilerStatistic'
import { Flex } from 'antd'

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
    <Flex vertical gap="small">
      <SpoilerStatistic title="Show definition" value={props.memo.definition} />
      <SpoilerStatistic
        title={randomPhrase?.translation}
        value={randomPhrase?.content}
      />
    </Flex>
  )
}

export default TranslationCard
