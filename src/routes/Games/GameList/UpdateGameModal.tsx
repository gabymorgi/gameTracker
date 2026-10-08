import { InputGame } from '@/components/Form/InputGame'
import { getChangedValues } from '@/utils/getChangedValues'
import { Button, Form } from 'antd'
import Modal from '@/components/ui/Modal'
import { useEffect, useRef } from 'react'
import { useMutation } from '@/hooks/useFetch'
import {
  Game,
  GameWithChangelogs,
  PrismaGameWithChangelogs,
} from '@/ts/api/games'

interface Props {
  selectedGame?: GameWithChangelogs
  onCancel: () => void
  onUpdated: (game: Game) => void
}

const UpdateGameModal: React.FC<Props> = (props) => {
  const parsedValues = useRef<Game>(undefined)
  const { mutate: updateGame, loading: isUpdateGameLoading } =
    useMutation('games/update')
  const [form] = Form.useForm()

  useEffect(() => {
    if (!props.selectedGame) return
    const { changelogs, playedTime, ...game } = props.selectedGame
    parsedValues.current = game as Game
    form.setFieldsValue({ game })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedGame])

  const handleFinish = async (values: { game: PrismaGameWithChangelogs }) => {
    const { changelogs, playedTime, ...game } = values.game
    const gameChanges = getChangedValues(parsedValues.current || {}, game)

    const updated = await updateGame({ ...gameChanges, id: game.id })
    props.onUpdated(updated)
    props.onCancel()
  }

  const formId = `form-${props.selectedGame?.id}`

  return (
    <Modal
      title="Update Game"
      open={!!props.selectedGame}
      onCancel={props.onCancel}
      footer={[
        <Button
          key="back"
          onClick={props.onCancel}
          disabled={isUpdateGameLoading}
        >
          Cancel
        </Button>,
        <Button
          disabled={isUpdateGameLoading}
          loading={isUpdateGameLoading}
          key="submit"
          htmlType="submit"
          form={formId}
        >
          Update
        </Button>,
      ]}
    >
      <Form
        form={form}
        key={formId}
        id={formId}
        onFinish={handleFinish}
        layout="vertical"
      >
        <Form.Item name="game" className="no-margin">
          <InputGame fieldName="game" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateGameModal
