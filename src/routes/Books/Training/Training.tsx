import { Options, query } from "@/hooks/useFetch";
import { EndPoint } from "@/ts";
import { Memo } from "@/ts/books";
import { Button, Card, Spin, message } from "antd";
import { useEffect, useState } from "react";
import FullCard from "../Training/FullCard";
import ListeningCard from "./ListeningCard";
import PhraseCard from "./PhraseCard";
import PronunciationCard from "./PronunciationCard";
import TranslationCard from "./TranslationCard";
import WordCard from "./WordCard";

enum Practice {
  LISTENING = "practiceListening",
  PHRASE = "practicePhrase",
  PRONUNCIATION = "practicePronunciation",
  TRANSLATION = "practiceTranslation",
  WORD = "practiceWord",
}

type Probabilities = {
  // one of the practices
  [key in Practice]: number;
};

function getRandomKey(activity: Memo): Practice {
  const probabilities: Probabilities = {
    [Practice.LISTENING]: 1 - activity.practiceListening,
    [Practice.PHRASE]: 1 - activity.practicePhrase,
    [Practice.PRONUNCIATION]: 1 - activity.practicePronunciation,
    [Practice.TRANSLATION]: 1 - activity.practiceTranslation,
    [Practice.WORD]: 1 - activity.practiceWord,
  };
  let total = 0;
  for (const key in probabilities) {
    total += probabilities[key as Practice];
  }

  let random = Math.random() * total;
  for (const key in probabilities) {
    random -= probabilities[key as Practice];
    if (random < 0) {
      return key as Practice;
    }
  }

  return Object.keys(probabilities)[0] as Practice;
}

function renderActivity(activity: Practice, memo: Memo) {
  switch (activity) {
    case Practice.LISTENING:
      return <ListeningCard memo={memo} />;
    case Practice.PHRASE:
      return <PhraseCard memo={memo} />;
    case Practice.PRONUNCIATION:
      return <PronunciationCard memo={memo} />;
    case Practice.TRANSLATION:
      return <TranslationCard memo={memo} />;
    case Practice.WORD:
      return <WordCard memo={memo} />;
  }
}

function WordList() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Memo[]>();
  const [selected, setSelected] = useState<Memo>();
  const [activity, setActivity] = useState<Practice>(Practice.WORD);
  const [showAnswer, setShowAnswer] = useState(false);

  async function refetch() {
    setLoading(true);
    const data = await query<Memo[]>(EndPoint.WORDS);
    setData(data);
    const random = Math.floor(Math.random() * data.length);
    setSelected(data[random]);
    setActivity(getRandomKey(data[random]));
    setLoading(false);
  }

  useEffect(() => {
    refetch();
  }, []);

  async function handleSuccess() {
    if (!selected) return;
    const updated = { ...selected };
    updated[activity] += 0.2;
    // iterate over Practice enum values and sum all values
    let total = 0;
    for (const key in Practice) {
      total += updated[Practice[key] as Practice];
    }
    
    const prom = total / Object.keys(Practice).length;
    if (prom > 0.99) {
      await query(EndPoint.WORDS, Options.DELETE, { id: updated.id });
      message.success("Word learned");
      handleNext();
      return;
    }
    await query(EndPoint.WORDS, Options.PUT, {}, updated);
    message.success(`Word updated ${prom.toFixed(2)}`);
    handleNext();
  }

  async function handleEdit(memo: Memo) {
    setData((prev) =>
      prev?.map((prevMemo) => {
        if (prevMemo.id === memo.id)
          return {
            ...prevMemo,
            ...memo,
          };
        return prevMemo;
      })
    );
  }

  function handleShowAnswer() {
    setShowAnswer(!showAnswer);
  }

  async function handleNext() {
    if (!data || data.length === 0) {
      await refetch();
      return;
    }
    setData((prev) => prev?.filter((memo) => memo.id !== selected?.id));
    const random = Math.floor(Math.random() * data.length);
    setSelected(data[random]);
    setShowAnswer(false);
    setActivity(getRandomKey(data[random]));
  }

  return (
    <Spin spinning={loading}>
      <div className="flex flex-col gap-16">
        <div>{data?.length || 0} left</div>
        {selected ? (
          <>
            <Card title={activity}>{renderActivity(activity, selected)}</Card>
            {showAnswer ? (
              <FullCard
                key={selected.id}
                memo={selected}
                handleDelete={handleNext}
                handleEdit={() => handleEdit(selected)}
              />
            ) : undefined}
          </>
        ) : undefined}
        <div className="flex justify-center gap-8">
          <Button key="show-answer" onClick={handleShowAnswer}>
            Show Answer
          </Button>
          <Button key="next" onClick={handleSuccess}>
            Success
          </Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </div>
    </Spin>
  );
}

export default WordList;
