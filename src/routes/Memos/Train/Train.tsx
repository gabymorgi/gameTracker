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
import { useLocalStorage } from 'usehooks-ts'
import { GenericObject } from '@/ts'
import { addHours, parseISO } from 'date-fns'

const StyledCard = styled(Card)`
  &.practiceListening {
    background-color: hsl(0, 100%, 8%);
  }
  &.practicePhrase {
    background-color: hsl(70, 100%, 8%);
  }
  &.practicePronunciation {
    background-color: hsl(170, 100%, 8%);
  }
  &.practiceTranslation {
    background-color: hsl(214, 100%, 8%);
  }
  &.practiceWord {
    background-color: hsl(301, 100%, 8%);
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
    [Practice.LISTENING]: 2 * (1 - activity.practiceListening),
    [Practice.PHRASE]: 3 * (1 - activity.practicePhrase),
    [Practice.PRONUNCIATION]: 3 * (1 - activity.practicePronunciation),
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
      return <ListeningCard key={memo.id} memo={memo} />
    case Practice.PHRASE:
      return <PhraseCard key={memo.id} memo={memo} />
    case Practice.PRONUNCIATION:
      return <PronunciationCard key={memo.id} memo={memo} />
    case Practice.TRANSLATION:
      return <TranslationCard key={memo.id} memo={memo} />
    case Practice.WORD:
      return <WordCard key={memo.id} memo={memo} />
  }
}

function WordList() {
  const [loading, setLoading] = useState(false)
  const [correct, setCorrect] = useState<number>(0)
  const [incorrect, setIncorrect] = useState<number>(0)
  const [bannedUntil, setBannedUntil] = useLocalStorage<GenericObject>(
    'word-incorrect',
    {},
  )
  const [data, setData] = useState<Memo[]>()
  const [selected, setSelected] = useState<Memo>()
  const [activity, setActivity] = useState<Practice>(Practice.WORD)
  const [showAnswer, setShowAnswer] = useState(false)

  async function refetch() {
    try {
      setLoading(true)
      for (const key of Object.keys(bannedUntil)) {
        if (parseISO(bannedUntil[key]) < new Date()) {
          delete bannedUntil[key]
        }
      }
      setBannedUntil(bannedUntil)
      const data = (
        await query('words/get', {
          filterValues: Object.keys(bannedUntil),
          limit: 12,
        })
      ).map(apiToMemo)
      setData(data)
      const random = Math.floor(Math.random() * data.length)
      setSelected(data[random])
      setActivity(getRandomKey(data[random]))
      setShowAnswer(!data[random].definition)
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSuccess() {
    if (!selected) return
    try {
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
          nextPractice: addHours(Date.now(), total * 24),
        })
        message.success(`Word updated ${(prom * 20).toFixed(0)} / 20`)
      }
      setCorrect(correct + 1)
      handleNext()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  function handleShowAnswer() {
    setShowAnswer(!showAnswer)
  }

  function handleFail() {
    if (!selected) return
    setIncorrect(incorrect + 1)
    let total = 0.25
    for (const value of Object.values(Practice)) {
      total += selected[value]
    }
    bannedUntil[selected?.value || ''] = addHours(
      Date.now(),
      total * 12,
    ).toISOString()
    setBannedUntil(bannedUntil)
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
      <Spin spinning={loading} fullscreen />
      <div>
        {data?.length || 0} left | {correct} correct | {incorrect} incorrect
      </div>
      {selected ? (
        <>
          {showAnswer ? (
            <MemoCard
              key={selected.id}
              memo={selected}
              handleDelete={handleNext}
              handleEdit={(memo) => setSelected(memo)}
            />
          ) : undefined}
          <StyledCard
            title={
              <Flex gap="small">
                <Icon path={icon[activity]} size={1} />
                <span>{title[activity]}</span>
              </Flex>
            }
            className={activity}
            extra={<MemoProgress memo={selected} />}
          >
            {renderActivity(activity, selected)}
          </StyledCard>
        </>
      ) : undefined}
      <Flex gap="middle">
        <Button key="show-answer" onClick={handleShowAnswer} type="dashed">
          {showAnswer ? 'Hide' : 'Show'} Answer
        </Button>
        <Button key="next" onClick={handleSuccess} type="primary">
          Success
        </Button>
        <Button onClick={handleFail} danger>
          Next
        </Button>
      </Flex>
    </Flex>
  )
}

export default WordList
