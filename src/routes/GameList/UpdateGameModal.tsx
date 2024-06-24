import { InputGame } from '@/components/Form/InputGame'
import { GameI } from '@/ts'
import { getChangedValues } from '@/utils/getChangedValues'
import { Button, Form } from 'antd'
import Modal from '@/components/ui/Modal'
import { useEffect, useRef, useState } from 'react'
import { query } from '@/hooks/useFetch'
import { formToGame, gameToForm } from '@/utils/gamesUtils'
import { parseISO } from 'date-fns'

interface Props {
  selectedGame?: GameI
  onOk: (game: GameI) => void
  onCancel: () => void
}

const UpdateGameModal: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false)
  const parsedValues = useRef<any>(props.selectedGame)
  const [form] = Form.useForm()

  async function changeGame() {
    if (!props.selectedGame) return
    const game = gameToForm(props.selectedGame)
    const changelogs = await query<any>('changelogs/get', 'GET', {
      gameId: game.id,
    })
    game.changeLogs = changelogs.map((log: any) => {
      const { game, gameId, ...rest } = log
      return {
        ...rest,
        createdAt: parseISO(rest.createdAt),
      }
    })
    parsedValues.current = game
    form.setFieldsValue({
      game,
    })
  }

  useEffect(() => {
    changeGame()
  }, [props.selectedGame])

  const handleFinish = async (values: any) => {
    // setLoading(true)
    const changedValues = getChangedValues(parsedValues.current, values.game)
    if (changedValues) {
      await query('games/asdf', 'GET', changedValues)
    }
    setLoading(false)
    props.onOk(formToGame(values.game))
  }

  const formId = `form-${props.selectedGame?.id}`

  return (
    <Modal
      title="Update Game"
      open={!!props.selectedGame}
      onCancel={props.onCancel}
      footer={[
        <Button key="back" onClick={props.onCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button
          disabled={loading}
          loading={loading}
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
        className="p-16"
      >
        <Form.Item name="game">
          <InputGame fieldName="game" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateGameModal
