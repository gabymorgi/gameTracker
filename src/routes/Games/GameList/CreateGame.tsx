import { Button, Form } from 'antd'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { InputGame } from '@/components/Form/InputGame'
import { useMutation } from '@/hooks/useFetch'
import { defaultNewGame } from '@/utils/defaultValue'
import { Game, GameWithChangeLogs } from '@/ts/api'

interface CreateGameProps {
  handleAddItem: (game: Game) => void
}

export const CreateGame: React.FC<CreateGameProps> = (props) => {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  // const [loading, setLoading] = useState(false)
  const { mutate: createGame, loading } = useMutation('games/create')

  const handleFinish = async ({ game }: { game: GameWithChangeLogs }) => {
    const createdGame = await createGame({
      ...game,
      changeLogs: {
        create: game.changeLogs || [],
        update: [],
        delete: [],
      },
      state: game.state,
      tags: {
        create: game.tags,
        update: [],
        delete: [],
      },
    })
    form.resetFields()
    props.handleAddItem({
      ...game,
      id: createdGame.id,
    })
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
