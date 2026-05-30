import Img from '@/components/ui/Img'
import { query, useMutation } from '@/hooks/useFetch'
import { Game } from '@/ts/api/games'
import {
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Skeleton,
} from 'antd'
import { useEffect, useState } from 'react'

interface FormValues {
  mark: number
  review: string
}

interface PendingReviewCardProps {
  game: Game
  loading: boolean
  onSubmit: (game: Game, values: FormValues) => Promise<void>
}

const PendingReviewCard: React.FC<PendingReviewCardProps> = ({
  game,
  loading,
  onSubmit,
}) => {
  const [form] = Form.useForm<FormValues>()

  return (
    <Card size="small" title={game.name}>
      <Flex vertical gap="small">
        <Img
          height={120}
          src={game.imageUrl || ''}
          alt={`${game.name} header`}
          errorComponent={<span className="font-16">{game.name}</span>}
        />
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => onSubmit(game, values)}
          initialValues={{
            mark: game.mark >= 0 ? game.mark : undefined,
            review: game.review || '',
          }}
        >
          <Form.Item
            label="Mark"
            name="mark"
            rules={[
              { required: true, message: 'Mark is required' },
              {
                type: 'number',
                min: 0,
                max: 10,
                message: 'Use a value from 0 to 10',
              },
            ]}
          >
            <InputNumber min={0} max={10} />
          </Form.Item>

          <Form.Item
            label="Review"
            name="review"
            rules={[
              {
                validator: (_, value) => {
                  if (typeof value === 'string' && value.trim().length > 0) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Review is required'))
                },
              },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 5 }}
              placeholder="Write a short review"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Form>
      </Flex>
    </Card>
  )
}

const PendingReviews: React.FC = () => {
  const [data, setData] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const { mutate: updateGame, loading: isUpdating } =
    useMutation('games/update')
  const [savingGameId, setSavingGameId] = useState<string>()

  const loadPage = async () => {
    setLoading(true)
    try {
      const data = await query('games/pending', undefined)
      setData(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPage()
  }, [])

  const handleSave = async (game: Game, values: FormValues) => {
    setSavingGameId(game.id)
    try {
      await updateGame({
        id: game.id,
        mark: values.mark,
        review: values.review,
      })
      if (data.length === 1) {
        loadPage()
      } else {
        setData((prev) => prev.filter((g) => g.id !== game.id))
      }
    } finally {
      setSavingGameId(undefined)
    }
  }

  if (loading && !data) {
    return <Skeleton active paragraph={{ rows: 8 }} />
  }

  return (
    <Flex vertical gap="middle">
      {!data?.length ? (
        <Card>
          <Empty description="No pending reviews" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {data.map((game) => (
            <Col key={game.id} xs={12} sm={8} md={6} lg={4}>
              <PendingReviewCard
                game={game}
                loading={isUpdating && savingGameId === game.id}
                onSubmit={handleSave}
              />
            </Col>
          ))}
        </Row>
      )}
    </Flex>
  )
}

export default PendingReviews
