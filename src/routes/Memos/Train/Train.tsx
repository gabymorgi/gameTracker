import { useMutation } from '@/hooks/useFetch'
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
import { message } from '@/contexts/GlobalContext'
import { useLocalStorage } from 'usehooks-ts'
import { GenericObject } from '@/ts'
import { addHours, parseISO } from 'date-fns'
import { Practice, Word } from '@/ts/api/words'
import IncorrectMemos, { IncorrectItem } from './IncorrectMemos'

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

function getNextKey(activity: Word): Practice {
  const keys = [
    Practice.PHRASE,
    Practice.LISTENING,
    Practice.PRONUNCIATION,
    Practice.TRANSLATION,
    Practice.WORD,
  ]

  return keys.reduce((prev, curr) =>
    activity[curr] < activity[prev] ? curr : prev,
  )
}

function renderActivity(activity: Practice, memo: Word) {
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
  const [correct, setCorrect] = useState<number>(0)
  const [incorrect, setIncorrect] = useState<IncorrectItem[]>([])
  const [bannedUntil, setBannedUntil] = useLocalStorage<GenericObject>(
    'word-incorrect',
    {},
  )
  const [data, setData] = useState<Word[]>()
  const { mutate: getWords, loading } = useMutation('words/get')
  const { mutate: learWord, loading: loadingLearn } = useMutation('words/learn')
  const { mutate: progressWord, loading: loadingProgress } =
    useMutation('words/update')
  const [selected, setSelected] = useState<Word>()
  const [activity, setActivity] = useState<Practice>(Practice.WORD)
  const [showAnswer, setShowAnswer] = useState(false)

  async function refetch() {
    for (const key of Object.keys(bannedUntil)) {
      if (parseISO(bannedUntil[key]) < new Date()) {
        delete bannedUntil[key]
      }
    }
    setBannedUntil(bannedUntil)
    const data = await getWords({
      filterValues: Object.keys(bannedUntil),
      take: 12,
    })
    setData(data)
    const random = Math.floor(Math.random() * data.length)
    setSelected(data[random])
    setActivity(getNextKey(data[random]))
    setShowAnswer(!data[random].definition)
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSuccess() {
    if (!selected) return
    // iterate over Practice enum values and sum all values
    let total = 0.25
    for (const value of Object.values(Practice)) {
      total += selected[value]
    }

    const prom = total / Object.keys(Practice).length
    if (prom > 0.99) {
      await learWord({ id: selected.id })
      message.success('Word learned')
    } else {
      await progressWord({
        id: selected.id,
        [activity]: selected[activity] + 0.25,
        nextPractice: addHours(Date.now(), total * 24),
      })
      message.success(`Word updated ${(prom * 20).toFixed(0)} / 20`)
    }
    setCorrect(correct + 1)
    handleNext()
  }

  function handleShowAnswer() {
    setShowAnswer(!showAnswer)
  }

  function handleFail() {
    if (!selected) return
    setIncorrect((prev) => [
      ...prev,
      {
        title: selected.value,
        description: [...(selected.definition || '').matchAll(/\[(.*?)\]/g)]
          .map((match) => match[1])
          .join(' - '),
      },
    ])
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
    setActivity(getNextKey(updated[random]))
  }

  return (
    <Spin spinning={loading || loadingLearn || loadingProgress}>
      <Flex vertical gap="middle">
        <IncorrectMemos
          left={data?.length || 0}
          correct={correct}
          incorrect={incorrect}
          banned={Object.keys(bannedUntil).length}
        />
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
          <Button
            key="show-answer"
            onClick={handleShowAnswer}
            color="default"
            variant="filled"
          >
            {showAnswer ? 'Hide' : 'Show'} Answer
          </Button>
          <Button key="next" onClick={handleSuccess} type="primary">
            Success
          </Button>
          <Button onClick={handleFail} color="danger" variant="filled">
            Next
          </Button>
        </Flex>
      </Flex>
    </Spin>
  )
}

export default WordList
