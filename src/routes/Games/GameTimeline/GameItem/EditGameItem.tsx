import { Button, Flex, Form, Input, InputNumber } from 'antd'
import { useEffect } from 'react'
import { FullHeightCard } from '@/styles/TableStyles'
import { mdiClose, mdiContentSave } from '@mdi/js'
import { Icon } from '@/components/ui/Icon'
import styled from 'styled-components'
import { InputState } from '@/components/Form/InputState'
import { InputTags } from '@/components/Form/InputTags'
import { getChangedValues } from '@/utils/getChangedValues'
import { useMutation } from '@/hooks/useFetch'
import { Game } from '@/ts/api/games'
import { ChangelogWithGame } from '@/ts/api/changelogs'
import { StyledEditButton } from './StyledEditButton'

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-inline-end: 0;
  }

  .ant-input-number {
    width: 50px;
  }

  .ant-form-item-inline.flex-grow {
    flex-grow: 1;
  }
` as typeof Form<FormValues>

interface FormValues {
  mark: number
  tags: string[]
  state: string
  review?: string | null
}

interface Props {
  game: ChangelogWithGame['game']
  active: boolean
  onClose: () => void
  onSaved: (game: Game) => void
}

const EditGameItem = (props: Props) => {
  const { game, active } = props
  const [form] = Form.useForm<FormValues>()
  const { mutate: updateGame, loading: isUpdateGameLoading } =
    useMutation('games/update')

  // The form stays mounted for the flip animation, so sync it each time it's shown
  useEffect(() => {
    if (active) {
      form.setFieldsValue({
        mark: game.mark,
        tags: game.tags,
        state: game.state,
        review: game.review,
      })
    }
  }, [active, form, game])

  async function handleFinish(values: FormValues) {
    const changedValues = getChangedValues(
      {
        id: game.id,
        mark: game.mark,
        tags: game.tags,
        state: game.state,
        review: game.review,
      },
      values,
    )
    const updatedGame = await updateGame(changedValues)
    props.onSaved(updatedGame)
  }

  const formId = `form-${game.id}`

  return (
    <FullHeightCard size="small" className="relative">
      <StyledEditButton
        anchor="topLeft"
        size="small"
        onClick={props.onClose}
        icon={<Icon path={mdiClose} size="small" />}
      />
      <StyledForm
        form={form}
        id={formId}
        onFinish={handleFinish}
        layout="inline"
        disabled={isUpdateGameLoading}
        initialValues={{
          id: game.id,
          mark: game.mark,
          tags: game.tags,
          state: game.state,
          review: game.review,
        }}
      >
        <Form.Item name="id" hidden>
          <Input type="hidden" />
        </Form.Item>
        <Flex vertical gap="small" align="stretch" className="w-full">
          <Flex gap="small" align="center" className="w-full">
            <span className="text-ellipsis flex-grow">{game.name}</span>
            <Form.Item name="mark">
              <InputNumber min={-1} max={10} />
            </Form.Item>
          </Flex>
          <Form.Item name="review">
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 3 }}
              placeholder="Game Review"
            />
          </Form.Item>
          <Form.Item name="tags" rules={[{ required: true }]}>
            <InputTags />
          </Form.Item>
          <Flex gap="small" align="stretch" className="w-full">
            <Form.Item
              className="flex-grow"
              name="state"
              rules={[{ required: true }]}
            >
              <InputState />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<Icon path={mdiContentSave} />}
              loading={isUpdateGameLoading}
            />
          </Flex>
        </Flex>
      </StyledForm>
    </FullHeightCard>
  )
}

export default EditGameItem
