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
        strokeColor="#00b96b"
        size={size}
        format={() => <Icon path={mdiEarHearing} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.PHRASE] * 100}
        strokeColor="#00b96b"
        size={size}
        format={() => <Icon path={mdiBookshelf} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.PRONUNCIATION] * 100}
        strokeColor="#00b96b"
        size={size}
        format={() => <Icon path={mdiMicrophone} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.TRANSLATION] * 100}
        strokeColor="#00b96b"
        size={size}
        format={() => <Icon path={mdiFormatFloatLeft} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.WORD] * 100}
        strokeColor="#00b96b"
        size={size}
        format={() => <Icon path={mdiTranslate} size={iconSize} />}
        type="circle"
      />
      <Progress
        percent={props.memo.priority * 5}
        strokeColor={conicColors}
        size={size}
        format={() => props.memo.priority}
        type="dashboard"
      />
    </div>
  )
}

export default MemoProgress
