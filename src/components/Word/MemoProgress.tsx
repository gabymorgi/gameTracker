import { Memo, Practice } from '@/ts/books'
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
  0, 1.7, 3.3, 5.0, 6.7, 10.0, 13.3, 16.7, 20.0, 25.0, 30.0, 35.0, 40.0, 46.7,
  53.3, 60.0, 66.7, 75.0, 83.3, 91.7, 100.0,
]

interface MemoProgressProps {
  memo: Memo
}

const conicColors: ProgressProps['strokeColor'] = {
  '12%': 'rgb(255, 99, 132)',
  '37%': 'rgb(54, 162, 235)',
  '63%': 'rgb(255, 205, 86)',
  '88%': 'rgb(75, 192, 192)',
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
        strokeColor="hsl(75, 100%, 50%)"
        trailColor="hsl(75, 50%, 20%)"
        size={size}
        format={() => <Icon path={mdiBookshelf} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.PRONUNCIATION] * 100}
        strokeColor="hsl(150, 100%, 50%)"
        trailColor="hsl(150, 50%, 20%)"
        size={size}
        format={() => <Icon path={mdiMicrophone} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.TRANSLATION] * 100}
        strokeColor="hsl(225, 100%, 50%)"
        trailColor="hsla(225, 50%, 20%)"
        size={size}
        format={() => <Icon path={mdiFormatFloatLeft} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.WORD] * 100}
        strokeColor="hsl(300, 100%, 50%)"
        trailColor="hsl(300, 50%, 20%)"
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
