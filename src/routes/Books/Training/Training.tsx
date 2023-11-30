import { Options, query } from '@/hooks/useFetch'
import { EndPoint } from '@/ts'
import { Memo, Practice } from '@/ts/books'
import { Button, Card, Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import ListeningCard from './ListeningCard'
import PhraseCard from './PhraseCard'
import PronunciationCard from './PronunciationCard'
import TranslationCard from './TranslationCard'
import WordCard from './WordCard'
import MemoCard from './MemoCard'
import styled from 'styled-components'
import MemoProgress from '../Memos/MemoProgress'
import {
  mdiBookshelf,
  mdiEarHearing,
  mdiFormatFloatLeft,
  mdiMicrophone,
  mdiTranslate,
} from '@mdi/js'
import Icon from '@mdi/react'

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
  const [data, setData] = useState<Memo[]>()
  const [selected, setSelected] = useState<Memo>()
  const [activity, setActivity] = useState<Practice>(Practice.WORD)
  const [showAnswer, setShowAnswer] = useState(false)

  async function refetch() {
    setLoading(true)
    const data = await query<Memo[]>(EndPoint.WORDS)
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
    const updated: Memo = { ...selected }
    updated[activity] += 0.25
    // iterate over Practice enum values and sum all values
    let total = 0
    for (const value of Object.values(Practice)) {
      total += updated[value]
    }

    const prom = total / Object.keys(Practice).length
    if (prom > 0.99) {
      await query(EndPoint.WORDS, Options.DELETE, { id: updated.id })
      message.success('Word learned')
      handleNext()
      return
    }
    await query(EndPoint.WORDS, Options.PUT, {}, updated)
    message.success(`Word updated ${prom.toFixed(2)}`)
    setCorrect(correct + 1)
    handleNext()
    setLoading(false)
  }

  function handleShowAnswer() {
    setShowAnswer(!showAnswer)
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
    <Spin spinning={loading}>
      <div className="flex flex-col gap-16">
        <div>
          {data?.length || 0} left | {correct} correct
        </div>
        {selected ? (
          <>
            {showAnswer ? (
              <MemoCard
                key={selected.id}
                memo={selected}
                handleDelete={handleNext}
                handleEdit={handleNext}
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
        <div className="flex justify-center gap-8">
          <Button
            key="show-answer"
            onClick={handleShowAnswer}
            type="dashed"
            danger
          >
            Show Answer
          </Button>
          <Button key="next" onClick={handleSuccess} type="primary">
            Success
          </Button>
          <Button onClick={handleNext} danger>
            Next
          </Button>
        </div>
      </div>
    </Spin>
  )
}

export default WordList
