import { Memo } from "@/ts/books";
import { useMemo } from "react";
import SpoilerStatistic from "../SpoilerStatistic";

interface PhraseCardProps {
  memo: Memo;
}

function PhraseCard(props: PhraseCardProps) {

  const randomPhrase = useMemo(() => {
    return props.memo.phrases[Math.floor(Math.random() * props.memo.phrases.length)];
  }, [props.memo.phrases]);

  return <>
    <SpoilerStatistic
      key={props.memo.id}
      title={randomPhrase.content || "-"}
      value={randomPhrase.translation || "-"}
    />
  </>
}

export default PhraseCard;
