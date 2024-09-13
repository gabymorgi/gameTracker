import { Button, Form } from 'antd'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { InputGame } from '@/components/Form/InputGame'
import { defaultNewGame } from '@/utils/defaultValue'
import { GameCreateInput, GameWithChangelogs } from '@/ts/api/games'

interface CreateGameProps {
  handleAddItem: (game: GameCreateInput) => Promise<void>
  loading?: boolean
}

export const CreateGame: React.FC<CreateGameProps> = (props) => {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  const handleFinish = async ({ game }: { game: GameWithChangelogs }) => {
    await props.handleAddItem({
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
  }
  return (
    <>
      <Button
        type="primary"
        loading={props.loading}
        disabled={props.loading}
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
            disabled={props.loading}
          >
            Cancel
          </Button>,
          <Button
            type="primary"
            disabled={props.loading}
            loading={props.loading}
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
