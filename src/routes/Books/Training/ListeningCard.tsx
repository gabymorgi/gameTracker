import { Memo } from "@/ts/books";
import { Button, Slider } from "antd";
import React, { useMemo, useState } from "react";
import SpoilerStatistic from "../SpoilerStatistic";

interface ListeningCardProps {
  memo: Memo;
}

function ListeningCard(props: ListeningCardProps) {
  const [rate, setRate] = useState(1);
  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    synth.speak(utterance);
  };

  const randomPhrase = useMemo(() => {
    return props.memo.phrases[Math.floor(Math.random() * props.memo.phrases.length)];
  }, [props.memo.phrases]);

  return <React.Fragment key={props.memo.id}>
    <Button onClick={() => speak(props.memo.word)}>Word</Button>
    <Button onClick={() => speak(randomPhrase.content)}>Phrase</Button>
    <Slider
      min={0.5}
      max={1}
      step={0.1}
      onChange={setRate}
      value={rate}
    />
    <SpoilerStatistic
      title="Reveal word"
      value={props.memo.word}
    />
  </React.Fragment>
}

export default ListeningCard;
