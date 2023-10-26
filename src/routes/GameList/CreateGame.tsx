import { Button, Form } from 'antd'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { CreatedGame } from '@/ts/index'
import { InputGame } from '@/components/Form/InputGame'

interface CreateGameProps {
  handleAddItem: (game: CreatedGame) => Promise<void>
}

export const CreateGame: React.FC<CreateGameProps> = (props) => {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleFinish = async ({ game }: { game: CreatedGame }) => {
    setLoading(true)
    await props.handleAddItem(game)
    form.resetFields()
    setLoading(false)
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
          layout="vertical"
          className="p-16"
        >
          <Form.Item name="game">
            <InputGame fieldName="game" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
