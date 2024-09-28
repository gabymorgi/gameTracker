import { Button, Flex } from 'antd'
import { useMemo, useRef } from 'react'
import SpoilerStatistic from '../SpoilerStatistic'
import { Word } from '@/ts/api/words'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'

interface ListeningCardProps {
  memo: Word
}

function ListeningCard(props: ListeningCardProps) {
  const rate = useRef(1)
  const speak = (text: string) => {
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = rate.current
    synth.speak(utterance)
  }

  const randomPhrase = useMemo(() => {
    return props.memo.phrases[
      Math.floor(Math.random() * props.memo.phrases.length)
    ]
  }, [props.memo.phrases])

  function handleChangeRate(value: number) {
    rate.current = value
    speak(randomPhrase?.content || 'empty')
  }

  return (
    <Flex vertical gap="middle">
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" align="center">
          <Button onClick={() => speak(props.memo.value)}>Word</Button>
          <Button onClick={() => speak(randomPhrase?.content || 'empty')}>
            Phrase
          </Button>
        </Flex>
        <Flex gap="small" align="center">
          <Button
            icon={<DoubleLeftOutlined />}
            onClick={() => handleChangeRate(rate.current - 0.1)}
          />
          <Button
            icon={<DoubleRightOutlined />}
            onClick={() => handleChangeRate(rate.current + 0.1)}
          />
        </Flex>
      </Flex>
      <SpoilerStatistic
        title="Reveal word"
        value={`${props.memo.value}\n\r${randomPhrase.content}`}
      />
    </Flex>
  )
}

export default ListeningCard
