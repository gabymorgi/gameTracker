import { Button, InputNumber } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'
import { mdiArrowRight } from '@mdi/js'
import { Icon } from '@/components/ui/Icon'

const WORDS_PER_PAGE = 275

interface InputPagesProps {
  value?: number | null
  onChange?: (value: number | null) => void
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #424242;
  border-radius: 6px;
  background: #141414;

  > .ant-input-number {
    height: 30px;
  }

  &:focus-within {
    border-color: #1677ff;
  }

  .ant-input-number {
    flex: 1;
    min-width: 0;
  }

  .arrow {
    flex: none;
    height: 30px;
    border-radius: 0;
    border-width: 0 1px;
    border-style: solid;
    border-color: #424242;
  }
`

export const InputPages = (props: InputPagesProps) => {
  const [words, setWords] = useState<number | null>(null)

  function convertWords() {
    if (!words) return
    props.onChange?.(Math.round(words / WORDS_PER_PAGE))
    setWords(null)
  }

  return (
    <Wrapper>
      <InputNumber
        className="w-full"
        variant="borderless"
        placeholder="Words"
        min={0}
        value={words}
        onChange={setWords}
        controls={false}
      />
      <Button
        className="arrow"
        type="text"
        disabled={!words}
        onClick={convertWords}
        icon={<Icon path={mdiArrowRight} />}
      />
      <InputNumber
        className="w-full"
        variant="borderless"
        placeholder="Pages"
        min={0}
        value={props.value}
        onChange={props.onChange}
        controls={false}
      />
    </Wrapper>
  )
}
