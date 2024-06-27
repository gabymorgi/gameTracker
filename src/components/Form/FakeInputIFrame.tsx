import { InputProps } from 'antd'
// import { getGameAchievementsUrl } from '@/utils/steam'
import IframeInput from './IframeInput'

type IframeInputProps = InputProps & {
  onTextReceived: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function FakeInputIFrame(props: IframeInputProps) {
  return props.value ? (
    <IframeInput
      text="Steam Achievements data:"
      url=""
      // url={getGameAchievementsUrl(Number(props.value))}
      onTextReceived={props.onTextReceived}
    />
  ) : (
    <span>(set app id to see the link)</span>
  )
}
