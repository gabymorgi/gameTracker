import SpoilerStatistic from '../SpoilerStatistic'
import { Button, Flex } from 'antd'
import { SoundFilled } from '@ant-design/icons'
import { Word } from '@/ts/api/words'

interface PronunciationCardProps {
  memo: Word
}

function PronunciationCard(props: PronunciationCardProps) {
  const speak = (text: string) => {
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 1
    synth.speak(utterance)
  }
  return (
    <Flex gap="small" justify="space-between" align="center">
      <SpoilerStatistic
        key={props.memo.id}
        title={props.memo.value}
        value={props.memo.pronunciation}
      />
      <Button icon={<SoundFilled />} onClick={() => speak(props.memo.value)}>
        Play
      </Button>
    </Flex>
  )
}

export default PronunciationCard
