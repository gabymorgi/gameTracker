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

interface MemoProgressProps {
  memo: Memo
}

const conicColors: ProgressProps['strokeColor'] = {
  '0%': '#4dff00',
  '50%': '#fffb00',
  '100%': '#ff1500',
}

function MemoProgress(props: MemoProgressProps) {
  const breakPoints = Grid.useBreakpoint()
  const size = breakPoints.md ? 30 : 24
  const iconSize = breakPoints.md ? '16px' : '14px'
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
        percent={props.memo.priority * 5}
        strokeColor={conicColors}
        trailColor="transparent"
        size={size}
        format={() => props.memo.priority}
        type="dashboard"
      />
    </Flex>
  )
}

export default MemoProgress
