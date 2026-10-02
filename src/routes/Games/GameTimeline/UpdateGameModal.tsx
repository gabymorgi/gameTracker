import { InputGame } from '@/components/Form/InputGame'
import { getChangedValues } from '@/utils/getChangedValues'
import { Button, Form } from 'antd'
import Modal from '@/components/ui/Modal'
import { useEffect, useRef } from 'react'
import { query, useMutation } from '@/hooks/useFetch'
import { Game, GameWithChangelogs } from '@/ts/api/games'

interface Props {
  selectedGame?: Partial<Game>
  onCancel: () => void
}

const UpdateGameModal: React.FC<Props> = (props) => {
  const parsedValues = useRef<Partial<GameWithChangelogs>>(undefined)
  const { mutate: updateGame, loading: isUpdateGameLoading } =
    useMutation('games/update')
  const { mutate: createChangelog } = useMutation('changelogs/create')
  const { mutate: updateChangelog } = useMutation('changelogs/update')
  const { mutate: deleteChangelog } = useMutation('changelogs/delete')
  const [form] = Form.useForm()

  async function changeGame() {
    if (!props.selectedGame) return
    const changelogs = await query('changelogs/get', {
      gameId: props.selectedGame.id,
      take: 6,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })
    changelogs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    parsedValues.current = {
      ...props.selectedGame,
      changelogs: changelogs.map((changelog) => ({
        ...changelog,
        gameId: changelog.game.id,
      })),
    }
    form.setFieldsValue({
      game: parsedValues.current,
    })
  }

  useEffect(() => {
    changeGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedGame])

  const handleFinish = async (values: { game: GameWithChangelogs }) => {
    const changedValues = getChangedValues(
      parsedValues.current || {},
      values.game,
    )
    const { changelogs, ...gameChanges } = changedValues || {}

    await updateGame(gameChanges)

    const gameId = props.selectedGame!.id!
    for (const changelog of changelogs?.create ?? []) {
      await createChangelog({ ...changelog, gameId })
    }
    for (const changelog of changelogs?.update ?? []) {
      await updateChangelog(changelog)
    }
    for (const id of changelogs?.delete ?? []) {
      await deleteChangelog({ id })
    }

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
