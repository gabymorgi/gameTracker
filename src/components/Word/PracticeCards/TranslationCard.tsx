import { useMemo } from 'react'
import SpoilerStatistic from '../SpoilerStatistic'
import { Flex } from 'antd'
import { Word } from '@/ts/api/words'
import FormatedDefinition from '@/components/ui/FormattedDefinition'

interface TranslationCardProps {
  memo: Word
}

function TranslationCard(props: TranslationCardProps) {
  const randomPhrase = useMemo(() => {
    return props.memo.phrases[
      Math.floor(Math.random() * props.memo.phrases.length)
    ]
  }, [props.memo.phrases])

  return (
    <Flex vertical gap="large">
      <SpoilerStatistic
        title="Show definition"
        value={<FormatedDefinition definition={props.memo.definition} />}
      />
      <SpoilerStatistic
        title={randomPhrase?.translation}
        value={randomPhrase?.content}
      />
    </Flex>
  )
}

export default TranslationCard
