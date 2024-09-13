import { Button, Card, Divider, Flex, List, Popconfirm } from 'antd'
import SpoilerStatistic from '@/components/Word/SpoilerStatistic'
import { query } from '@/hooks/useFetch'
import { SoundFilled } from '@ant-design/icons'
import MemoProgress from '@/components/Word/MemoProgress'
import { Word } from '@/ts/api/words'
interface FullCardProps {
  memo: Word
  handleDelete: (id: string) => void
  handleEdit: () => void
}

function FullCard(props: FullCardProps) {
  async function handleDeleteMemo() {
    await query('words/delete', 'DELETE', { id: props.memo.id })
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
        <Flex gap="small">
          <span>{props.memo.value}</span>
          <Button
            size="small"
            icon={<SoundFilled />}
            onClick={() => speak(props.memo.value)}
          />
        </Flex>
      }
      extra={
        <Flex gap="small">
          <MemoProgress memo={props.memo} />
        </Flex>
      }
    >
      <SpoilerStatistic
        defaultIsLoading={false}
        title={props.memo.pronunciation}
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
              defaultIsLoading={false}
              title={phrase.content}
              value={phrase.translation}
            />
          </List.Item>
        )}
      />
      <Divider />
      <Flex gap="small">
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
      </Flex>
    </Card>
  )
}

export default FullCard
