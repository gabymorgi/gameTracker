import { Button, Card, Divider, Flex, Listy, Popconfirm } from 'antd'
import SpoilerStatistic from '@/components/Word/SpoilerStatistic'
import { query } from '@/hooks/useFetch'
import { SoundFilled } from '@ant-design/icons'
import MemoProgress from '@/components/Word/MemoProgress'
import { Word } from '@/ts/api/words'
import FormatedDefinition from '@/components/ui/FormattedDefinition'
interface FullCardProps {
  memo: Word
  handleDelete: (id: string) => void
  handleEdit: () => void
}

function FullCard(props: FullCardProps) {
  async function handleDeleteMemo() {
    await query('words/delete', { id: props.memo.id })
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
        value={<FormatedDefinition definition={props.memo.definition} />}
      />
      <Divider />
      <Listy
        rowKey="content"
        items={props.memo.phrases}
        itemRender={(phrase) => (
          <div className="relative">
            <div style={{ position: 'absolute', top: 4, left: 4, zIndex: 1 }}>
              <Button
                size="small"
                icon={<SoundFilled />}
                onClick={() => speak(phrase.content)}
              />
            </div>
            <div>
              <SpoilerStatistic
                defaultIsLoading={false}
                title={phrase.content}
                value={phrase.translation}
              />
            </div>
          </div>
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
