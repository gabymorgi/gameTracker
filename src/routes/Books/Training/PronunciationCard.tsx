import { Memo } from "@/ts/books";
import SpoilerStatistic from "../SpoilerStatistic";
import { Button } from "antd";

interface PronunciationCardProps {
  memo: Memo;
}

function PronunciationCard(props: PronunciationCardProps) {
  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    synth.speak(utterance);
  };
  return <>
    <SpoilerStatistic
      key={props.memo.id}
      title={props.memo.word || "-"}
      value={props.memo.pronunciation || "-"}
    />
    <Button onClick={() => speak(props.memo.word)}>Spoil</Button>
  </>
}

export default PronunciationCard;
