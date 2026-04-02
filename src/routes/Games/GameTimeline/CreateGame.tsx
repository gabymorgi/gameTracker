import { Button, Form } from 'antd'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { InputGame } from '@/components/Form/InputGame'
import { defaultNewGame } from '@/utils/defaultValue'
import { GameWithChangelogs } from '@/ts/api/games'
import { useMutation } from '@/hooks/useFetch'

export const CreateGame: React.FC = () => {
  const { mutate: createGame, loading: isCreateGameLoading } =
    useMutation('games/create')
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  const handleFinish = async ({ game }: { game: GameWithChangelogs }) => {
    await createGame({
      ...game,
      changelogs: {
        create: game.changelogs || [],
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
        loading={isCreateGameLoading}
        disabled={isCreateGameLoading}
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
            disabled={isCreateGameLoading}
          >
            Cancel
          </Button>,
          <Button
            type="primary"
            disabled={isCreateGameLoading}
            loading={isCreateGameLoading}
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
