import { InputGame } from '@/components/Form/InputGame'
import { GameI } from '@/ts/game'
import { getChangedValues } from '@/utils/getChangedValues'
import { Button, Form } from 'antd'
import Modal from '@/components/ui/Modal'
import { useEffect, useRef, useState } from 'react'
import { query } from '@/hooks/useFetch'
import { apiToChangelog } from '@/utils/format'

interface Props {
  selectedGame?: GameI
  onOk: (game: GameI) => void
  onCancel: () => void
}

const UpdateGameModal: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false)
  const parsedValues = useRef<GameI | undefined>(props.selectedGame)
  const [form] = Form.useForm()

  async function changeGame() {
    if (!props.selectedGame) return
    const changelogs = (
      await query('changelogs/get', {
        gameId: props.selectedGame.id,
      })
    ).map((log) => apiToChangelog(log))
    changelogs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    props.selectedGame.changeLogs = changelogs
    parsedValues.current = props.selectedGame
    form.setFieldsValue({
      game: parsedValues.current,
    })
  }

  useEffect(() => {
    changeGame()
  }, [props.selectedGame])

  const handleFinish = async (values: { game: GameI }) => {
    setLoading(true)
    const changedValues = getChangedValues(
      parsedValues.current || {},
      values.game,
    )
    if (changedValues) {
      await query('games/update', changedValues)
    }
    setLoading(false)
    props.onOk(values.game)
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
        className="p-middle"
      >
        <Form.Item name="game">
          <InputGame fieldName="game" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateGameModal
