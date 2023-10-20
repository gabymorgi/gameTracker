import { Memo } from "@/ts/books";
import { Button, Card, Divider, List, Popconfirm, Tag } from "antd";
import SpoilerStatistic from "../SpoilerStatistic";
import { Options, query } from "@/hooks/useFetch";
import { EndPoint } from "@/ts";
import { SoundFilled } from "@ant-design/icons";
interface FullCardProps {
  memo: Memo;
  handleDelete: (id: string) => void;
  handleEdit: () => void;
}

function FullCard(props: FullCardProps) {
  async function handleDeleteMemo() {
    await query(EndPoint.WORDS, Options.DELETE, {
      id: props.memo.id,
    });
    props.handleDelete(props.memo.id);
  }

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    synth.speak(utterance);
  };

  return (
    <Card
      title={
        <div className="flex gap-8">
          <span>{props.memo.word}</span>
          <Button
            size="small"
            icon={<SoundFilled />}
            onClick={() => speak(props.memo.word)}
          />
        </div>
      }
      extra={
        <div className="flex gap-8">
          <Tag>Lis {props.memo.practiceListening.toFixed(1)}</Tag>
          <Tag>Phr {props.memo.practicePhrase.toFixed(1)}</Tag>
          <Tag>Prn {props.memo.practicePronunciation.toFixed(1)}</Tag>
          <Tag>Tra {props.memo.practiceTranslation.toFixed(1)}</Tag>
          <Tag>Wrd {props.memo.practiceWord.toFixed(1)}</Tag>
          <Tag>Priority {props.memo.priority}</Tag>
        </div>
      }
    >
      <SpoilerStatistic
        title={props.memo.pronunciation || "-"}
        value={props.memo.definition}
      />
      <Divider />
      <List
        dataSource={props.memo.phrases}
        renderItem={(phrase) => (
          <List.Item
            extra={
              <Button
                icon={<SoundFilled />}
                onClick={() => speak(phrase.content)}
              />
            }
          >
            <SpoilerStatistic
              title={phrase.content}
              value={phrase.translation}
            />
          </List.Item>
        )}
      />
      <Divider />
      <div className="flex gap-8">
        <Popconfirm
          key="Delete"
          title="Are you sure to delete this memo and phrases?"
          onConfirm={handleDeleteMemo}
          okText="Yes"
          cancelText="No"
        >
          <Button danger key="Delete">
            Delete
          </Button>
        </Popconfirm>
        <Button key="Edit" onClick={props.handleEdit}>
          Edit
        </Button>
      </div>
    </Card>
  );
}

export default FullCard;
