import { Button, Flex, Slider } from 'antd'
import { useMemo, useState } from 'react'
import SpoilerStatistic from '../SpoilerStatistic'
import { Word } from '@/ts/api/words'

interface ListeningCardProps {
  memo: Word
}

function ListeningCard(props: ListeningCardProps) {
  const [rate, setRate] = useState(1)
  const speak = (text: string) => {
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = rate
    synth.speak(utterance)
  }

  const randomPhrase = useMemo(() => {
    return props.memo.phrases[
      Math.floor(Math.random() * props.memo.phrases.length)
    ]
  }, [props.memo.phrases])

  return (
    <Flex vertical gap="small">
      <Flex gap="small" align="center">
        <Button onClick={() => speak(props.memo.value)}>Word</Button>
        <Button onClick={() => speak(randomPhrase?.content || 'empty')}>
          Phrase
        </Button>
        <Slider
          className="w-full"
          min={0.5}
          max={1}
          step={0.05}
          onChange={setRate}
          value={rate}
        />
      </Flex>
      <SpoilerStatistic
        title="Reveal word"
        value={`${props.memo.value}\n\r${randomPhrase.content}`}
      />
    </Flex>
  )
}

export default ListeningCard
