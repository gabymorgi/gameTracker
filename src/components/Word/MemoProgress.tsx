import { isMobile } from '@/styles/Resolutions'
import { Memo, Practice } from '@/ts/books'
import {
  mdiBookshelf,
  mdiEarHearing,
  mdiFormatFloatLeft,
  mdiMicrophone,
  mdiTranslate,
} from '@mdi/js'
import Icon from '@mdi/react'
import { Progress } from 'antd'
import { ProgressProps } from 'antd/lib'
import { useMediaQuery } from 'usehooks-ts'

interface MemoProgressProps {
  memo: Memo
}

const conicColors: ProgressProps['strokeColor'] = {
  '0%': '#4dff00',
  '50%': '#fffb00',
  '100%': '#ff1500',
}

function MemoProgress(props: MemoProgressProps) {
  const isMobileMatch = useMediaQuery(`(${isMobile})`)
  const size = isMobileMatch ? 24 : 30
  const iconSize = isMobileMatch ? '12px' : '14px'
  return (
    <div className="flex gap-4">
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
    </div>
  )
}

export default MemoProgress
