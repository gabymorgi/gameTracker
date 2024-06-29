import { query } from '@/hooks/useFetch'
import { Memo, Practice } from '@/ts/books'
import { Button, Card, Flex, Spin } from 'antd'
import { useEffect, useState } from 'react'
import ListeningCard from '@/components/Word/PracticeCards/ListeningCard'
import PhraseCard from '@/components/Word/PracticeCards/PhraseCard'
import PronunciationCard from '@/components/Word/PracticeCards/PronunciationCard'
import TranslationCard from '@/components/Word/PracticeCards/TranslationCard'
import WordCard from '@/components/Word/PracticeCards/WordCard'
import MemoCard from './MemoCard'
import styled from 'styled-components'
import MemoProgress from '../../../components/Word/MemoProgress'
import {
  mdiBookshelf,
  mdiEarHearing,
  mdiFormatFloatLeft,
  mdiMicrophone,
  mdiTranslate,
} from '@mdi/js'
import Icon from '@mdi/react'
import { apiToMemo } from '@/utils/format'
import { message } from '@/contexts/GlobalContext'

const StyledCard = styled(Card)`
  &.practiceListening {
    background-color: hsl(0, 100%, 8%);
  }
  &.practicePhrase {
    background-color: hsl(75, 100%, 8%);
  }
  &.practicePronunciation {
    background-color: hsl(150, 100%, 8%);
  }
  &.practiceTranslation {
    background-color: hsl(225, 100%, 8%);
  }
  &.practiceWord {
    background-color: hsl(300, 100%, 8%);
  }
`

const title = {
  [Practice.LISTENING]: 'Listening',
  [Practice.PHRASE]: 'To spanish',
  [Practice.PRONUNCIATION]: 'Speaking',
  [Practice.TRANSLATION]: 'To English',
  [Practice.WORD]: 'Word',
}

const icon = {
  [Practice.LISTENING]: mdiEarHearing,
  [Practice.PHRASE]: mdiBookshelf,
  [Practice.PRONUNCIATION]: mdiMicrophone,
  [Practice.TRANSLATION]: mdiFormatFloatLeft,
  [Practice.WORD]: mdiTranslate,
}

type Probabilities = {
  // one of the practices
  [key in Practice]: number
}

function getRandomKey(activity: Memo): Practice {
  const probabilities: Probabilities = {
    [Practice.LISTENING]: 1 - activity.practiceListening,
    [Practice.PHRASE]: 1 - activity.practicePhrase,
    [Practice.PRONUNCIATION]: 1 - activity.practicePronunciation,
    [Practice.TRANSLATION]: 1 - activity.practiceTranslation,
    [Practice.WORD]: 1 - activity.practiceWord,
  }
  let total = 0
  for (const key in probabilities) {
    total += probabilities[key as Practice]
  }

  let random = Math.random() * total
  for (const key in probabilities) {
    random -= probabilities[key as Practice]
    if (random < 0) {
      return key as Practice
    }
  }

  return Object.keys(probabilities)[0] as Practice
}

function renderActivity(activity: Practice, memo: Memo) {
  switch (activity) {
    case Practice.LISTENING:
      return <ListeningCard memo={memo} />
    case Practice.PHRASE:
      return <PhraseCard memo={memo} />
    case Practice.PRONUNCIATION:
      return <PronunciationCard memo={memo} />
    case Practice.TRANSLATION:
      return <TranslationCard memo={memo} />
    case Practice.WORD:
      return <WordCard memo={memo} />
  }
}

function WordList() {
  const [loading, setLoading] = useState(false)
  const [correct, setCorrect] = useState<number>(0)
  const [incorrect, setIncorrect] = useState(new Set<string>())
  const [data, setData] = useState<Memo[]>()
  const [selected, setSelected] = useState<Memo>()
  const [activity, setActivity] = useState<Practice>(Practice.WORD)
  const [showAnswer, setShowAnswer] = useState(false)

  async function refetch() {
    setLoading(true)
    const data = (await query('words/get')).map((m) => apiToMemo(m))
    setData(data)
    const random = Math.floor(Math.random() * data.length)
    setSelected(data[random])
    setActivity(getRandomKey(data[random]))
    setShowAnswer(!data[random].definition)
    setLoading(false)
  }

  useEffect(() => {
    refetch()
  }, [])

  async function handleSuccess() {
    if (!selected) return
    setLoading(true)
    // iterate over Practice enum values and sum all values
    let total = 0.25
    for (const value of Object.values(Practice)) {
      total += selected[value]
    }

    const prom = total / Object.keys(Practice).length
    if (prom > 0.99) {
      await query('words/learn', { id: selected.id })
      message.success('Word learned')
    } else {
      await query('words/progress', {
        id: selected.id,
        [activity]: selected[activity] + 0.25,
        total,
      })
      message.success(`Word updated ${(prom * 20).toFixed(0)} / 20`)
    }
    setCorrect(correct + 1)
    handleNext()
    setLoading(false)
  }

  function handleShowAnswer() {
    setShowAnswer(!showAnswer)
  }

  function handleFail() {
    setIncorrect(new Set([...incorrect, selected?.value || '']))
    handleNext()
  }

  async function handleNext() {
    if (!data || data.length === 1) {
      await refetch()
      return
    }
    const updated = data.filter((memo) => memo.id !== selected?.id)
    setData(updated)
    const random = Math.floor(Math.random() * updated.length)
    setSelected(updated[random])
    setShowAnswer(!updated[random].definition)
    setActivity(getRandomKey(updated[random]))
  }

  return (
    <Flex vertical gap="middle">
      <div>
        {data?.length || 0} left | {correct} correct | {incorrect.size}{' '}
        incorrect
      </div>
      {selected ? (
        <>
          {showAnswer ? (
            <MemoCard
              key={selected.id}
              memo={selected}
              handleDelete={handleNext}
              handleEdit={() => {}} // noop
            />
          ) : undefined}
          <StyledCard
            title={
              <div className="flex gap-4">
                <Icon path={icon[activity]} size={1} />
                <span>{title[activity]}</span>
              </div>
            }
            className={activity}
            extra={<MemoProgress memo={selected} />}
          >
            {renderActivity(activity, selected)}
          </StyledCard>
        </>
      ) : undefined}
      <Flex gap="middle">
        <Button
          key="show-answer"
          onClick={handleShowAnswer}
          type="dashed"
          danger
        >
          Show Answer
        </Button>
        <Button
          key="next"
          onClick={handleSuccess}
          type="primary"
          disabled={incorrect.has(selected?.value || '')}
        >
          Success
        </Button>
        <Button onClick={handleFail} danger>
          Next
        </Button>
      </Flex>
      <Spin spinning={loading} fullscreen />
    </Flex>
  )
}

export default WordList
