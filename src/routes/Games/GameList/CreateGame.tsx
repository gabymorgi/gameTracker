import { Button, Form } from 'antd'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { GameI } from '@/ts/game'
import { InputGame } from '@/components/Form/InputGame'
import { query } from '@/hooks/useFetch'
import { defaultNewGame } from '@/utils/defaultValue'

interface CreateGameProps {
  handleAddItem: (game: GameI) => void
}

export const CreateGame: React.FC<CreateGameProps> = (props) => {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFinish = async ({ game }: { game: GameI }) => {
    setLoading(true)
    try {
      const createdGame = await query('games/create', {
        ...game,
        changeLogs: {
          create: game.changeLogs,
        },
        tags: {
          create: game.tags,
        },
      })
      form.resetFields()
      props.handleAddItem({
        ...game,
        id: createdGame.id,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <Button
        type="primary"
        loading={loading}
        disabled={loading}
        onClick={() => setModalVisible(true)}
      >
        New Game
      </Button>
      <Modal
        title="Create Game"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="back"
            onClick={() => setModalVisible(false)}
            disabled={loading}
          >
            Cancel
          </Button>,
          <Button
            type="primary"
            disabled={loading}
            loading={loading}
            key="submit"
            htmlType="submit"
            form="create-game-form"
          >
            Create
          </Button>,
        ]}
      >
        <Form
          id="create-game-form"
          form={form}
          onFinish={handleFinish}
          initialValues={{ game: defaultNewGame }}
          layout="vertical"
          className="p-middle"
        >
          <Form.Item name="game" className="no-margin">
            <InputGame fieldName="game" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
