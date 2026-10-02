import { Button, Flex, Form, Input, InputNumber } from 'antd'
import { useContext, useState } from 'react'
import { FullHeightCard, GameImg } from '@/styles/TableStyles'
import { ScoreRibbon } from '@/components/ui/ScoreRibbon'
import { Tags } from '@/components/ui/Tags'
import { CloseOutlined, EditFilled, SaveOutlined } from '@ant-design/icons'
import { AuthContext } from '@/contexts/AuthContext'
import { formatPlayedTime } from '@/utils/format'
import styled, { css } from 'styled-components'
import { TrueProgress } from '@/components/ui/TrueProgress'
import { StateIcon } from '@/components/ui/StateIcon'
import { ChangelogWithGame } from '@/ts/api/changelogs'
import { InputState } from '@/components/Form/InputState'
import { InputTags } from '@/components/Form/InputTags'
import { getChangedValues } from '@/utils/getChangedValues'
import { useMutation } from '@/hooks/useFetch'

const StyledPercentage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #141414;
  color: white;
  padding: 8px 6px 6px 8px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 6px;
  line-height: 1;
  z-index: 1;
`

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

const StyledEditButton = styled(Button)<{ anchor?: 'bottomRight' | 'topLeft' }>`
  position: absolute;
  ${({ anchor }) => {
    switch (anchor) {
      case 'topLeft':
        return css`
          top: -1px;
          left: -1px;
        `
      case 'bottomRight':
      default:
        return css`
          bottom: -13px;
          right: -13px;
        `
    }
  }}
`

interface Props {
  monthPlayedTime: number
  changelogGame: ChangelogWithGame
  // setSelectedGame: (changelogGame: ChangelogWithGame) => void
}

interface FormValues {
  mark: number
  tags: string[]
  state: string
  review: string
}

function GameItem(props: Props) {
  const { isAuthenticated } = useContext(AuthContext)
  const { game } = props.changelogGame
  const [isEditing, setIsEditing] = useState(false)
  const { mutate: updateGame, loading: isUpdateGameLoading } =
    useMutation('games/update')

  async function handleFinish(values: FormValues) {
    const changedValues = getChangedValues(
      {
        mark: game.mark,
        tags: game.tags,
        state: game.state,
        review: game.review,
      },
      values,
    )
    console.log(changedValues)
    await updateGame({
      id: game.id,
      ...changedValues,
    })
    setIsEditing(false)
  }

  const formId = `form-${game.id}`

  return isEditing ? (
    <FullHeightCard size="small" className="relative">
      <StyledEditButton
        anchor="topLeft"
        size="small"
        onClick={() => setIsEditing(false)}
        // onClick={() => props.setSelectedGame(props.changelogGame.game)}
        icon={<CloseOutlined />}
      />
      <StyledForm
        key={formId}
        id={formId}
        onFinish={handleFinish}
        layout="inline"
        disabled={isUpdateGameLoading}
        initialValues={{
          mark: game.mark,
          tags: game.tags,
          state: game.state,
          review: game.review,
        }}
      >
        <Flex vertical gap="small" align="stretch" className="w-full">
          <Flex gap="small" align="center" className="w-full">
            <span className="text-ellipsis flex-grow">{game.name}</span>
            <Form.Item name="mark">
              <InputNumber min={-1} max={10} />
            </Form.Item>
          </Flex>
          <Form.Item name="review">
            <Input.TextArea
              autoSize={{ minRows: 3 }}
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
              icon={<SaveOutlined />}
              loading={isUpdateGameLoading}
            />
          </Flex>
        </Flex>
      </StyledForm>
    </FullHeightCard>
  ) : (
    <FullHeightCard size="small">
      <StyledPercentage>
        {Math.round((props.changelogGame.hours / props.monthPlayedTime) * 100)}%
      </StyledPercentage>
      <ScoreRibbon mark={game.mark} review={game.review} iconColor="#333" />
      <Flex vertical gap="small" align="stretch" className="h-full relative">
        <div className="relative">
          <GameImg
            title={game.name || undefined}
            href={`https://steampowered.com/app/${game.appid}`}
            width="250px"
            height="120px"
            className="object-cover self-align-center"
            src={game.imageUrl || ''}
            alt={`${game.name} header`}
            errorComponent={
              <a
                className="font-16"
                href={`https://steampowered.com/app/${game.appid}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {game.name}
              </a>
            }
          />
          <StateIcon state={game.state} />
        </div>
        {isAuthenticated ? (
          <TrueProgress
            obtainedActual={props.changelogGame.hours}
            obtainedTotal={game.playedTime + (game.extraPlayedTime || 0)}
            total={game.playedTime + (game.extraPlayedTime || 0)}
            color="hsl(60 80% 30%)"
            formatLabel={formatPlayedTime}
          />
        ) : undefined}
        <div className="text-center">
          {game.totalAchievements ? (
            <TrueProgress
              obtainedActual={props.changelogGame.achievements}
              obtainedTotal={game.obtainedAchievements}
              total={game.totalAchievements}
            />
          ) : (
            'no data'
          )}
        </div>
        <Tags tags={game.tags} />
        {isAuthenticated ? (
          <StyledEditButton
            anchor="bottomRight"
            size="small"
            onClick={() => setIsEditing(true)}
            // onClick={() => props.setSelectedGame(props.changelogGame.game)}
            icon={<EditFilled />}
          />
        ) : undefined}
      </Flex>
    </FullHeightCard>
  )
}

export default GameItem
