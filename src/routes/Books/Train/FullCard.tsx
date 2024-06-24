import { Memo } from '@/ts/books'
import { Button, Card, Divider, List, Popconfirm, Tag } from 'antd'
import SpoilerStatistic from '../../../components/Word/SpoilerStatistic'
import { query } from '@/hooks/useFetch'
import { SoundFilled } from '@ant-design/icons'
import MemoProgress from '../../../components/Word/MemoProgress'
interface FullCardProps {
  memo: Memo
  handleDelete: (id: string) => void
  handleEdit: () => void
}

function FullCard(props: FullCardProps) {
  async function handleDeleteMemo() {
    await query(`words/delete`, 'DELETE', { id: props.memo.id })
    props.handleDelete(props.memo.id)
  }

  const speak = (text: string) => {
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 1
    synth.speak(utterance)
  }

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
          <MemoProgress memo={props.memo} />
          <Tag>Priority {props.memo.priority}</Tag>
        </div>
      }
    >
      <SpoilerStatistic
        title={props.memo.pronunciation || '-'}
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
  )
}

export default FullCard
