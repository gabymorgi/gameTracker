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

interface MemoProgressProps {
  memo: Memo
}

function MemoProgress(props: MemoProgressProps) {
  return (
    <div className="flex gap-4">
      <Progress
        percent={props.memo[Practice.LISTENING] * 100}
        strokeColor="#00b96b"
        size={30}
        format={() => <Icon path={mdiEarHearing} size="14px" />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.PHRASE] * 100}
        strokeColor="#00b96b"
        size={30}
        format={() => <Icon path={mdiBookshelf} size="14px" />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.PRONUNCIATION] * 100}
        strokeColor="#00b96b"
        size={30}
        format={() => <Icon path={mdiMicrophone} size="14px" />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.TRANSLATION] * 100}
        strokeColor="#00b96b"
        size={30}
        format={() => <Icon path={mdiFormatFloatLeft} size="14px" />}
        type="circle"
      />
      <Progress
        percent={props.memo[Practice.WORD] * 100}
        strokeColor="#00b96b"
        size={30}
        format={() => <Icon path={mdiTranslate} size="14px" />}
        type="circle"
      />
    </div>
  )
}

export default MemoProgress
