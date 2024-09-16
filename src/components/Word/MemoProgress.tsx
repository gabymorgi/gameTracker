import { Practice, Word } from '@/ts/api/words'
import {
  mdiBookshelf,
  mdiEarHearing,
  mdiFormatFloatLeft,
  mdiMicrophone,
  mdiTranslate,
} from '@mdi/js'
import Icon from '@mdi/react'
import { Flex, Grid, Progress } from 'antd'
import { ProgressProps } from 'antd/lib'
import { useMemo } from 'react'

const totalProgressValues = [
  0, 1.8, 3.2, 4.9, 7.2, 10.2, 13.4, 16.9, 21.0, 25.8, 30.8, 36.0, 41.9, 48.4,
  55.2, 62.2, 69.9, 78.2, 86.8, 95.6, 100.0,
]

interface MemoProgressProps {
  memo: Word
}

const conicColors: ProgressProps['strokeColor'] = {
  '0%': 'hsl(281, 100%, 50%)',
  '12%': 'hsl(0, 100%, 50%)',
  '37%': 'hsl(58, 100%, 50%)',
  '63%': 'hsl(150, 100%, 50%)',
  '88%': 'hsl(194, 100%, 50%)',
  '100%': 'hsl(281, 100%, 50%)',
}

function MemoProgress(props: MemoProgressProps) {
  const breakPoints = Grid.useBreakpoint()
  const size = breakPoints.md ? 30 : 24
  const iconSize = breakPoints.md ? '16px' : '14px'

  const totalProgress = useMemo(() => {
    const total = Math.round(
      Object.values(Practice).reduce(
        (acc, value) => acc + props.memo[value as Practice],
        0,
      ) * 4,
    )
    return totalProgressValues[total]
  }, [props.memo])

  return (
    <Flex gap="small">
      <Progress
        percent={props.memo[Practice.LISTENING] * 100}
        strokeColor="hsl(0, 100%, 50%)"
        trailColor="hsl(0, 50%, 20%)"
        size={size}
        format={() => <Icon path={mdiEarHearing} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.PHRASE] * 100}
        strokeColor="hsl(70, 100%, 50%)"
        trailColor="hsl(70, 50%, 20%)"
        size={size}
        format={() => <Icon path={mdiBookshelf} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.PRONUNCIATION] * 100}
        strokeColor="hsl(170, 100%, 50%)"
        trailColor="hsl(170, 50%, 20%)"
        size={size}
        format={() => <Icon path={mdiMicrophone} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.TRANSLATION] * 100}
        strokeColor="hsl(214, 100%, 50%)"
        trailColor="hsla(214, 50%, 20%)"
        size={size}
        format={() => <Icon path={mdiFormatFloatLeft} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.WORD] * 100}
        strokeColor="hsl(301, 100%, 50%)"
        trailColor="hsl(301, 50%, 20%)"
        size={size}
        format={() => <Icon path={mdiTranslate} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={totalProgress}
        strokeColor={conicColors}
        trailColor="transparent"
        size={size}
        format={() => props.memo.priority}
        type="circle"
      />
    </Flex>
  )
}

export default MemoProgress
