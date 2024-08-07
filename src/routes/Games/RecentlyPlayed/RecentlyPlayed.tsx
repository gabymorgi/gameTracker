import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Row, Affix, message, Flex } from 'antd'
import { getRecentlyPlayed } from '@/utils/steam'
import { Link } from 'react-router-dom'
import { InputGame } from '@/components/Form/InputGame'
import { PlusCircleFilled } from '@ant-design/icons'
import { ValidateErrorEntity } from 'rc-field-form/lib/interface'
import { query } from '@/hooks/useFetch'
import { NotificationLogger } from '@/utils/notification'
import { getChangedValues } from '@/utils/getChangedValues'
import { wait } from '@/utils/promise'
import { GameI } from '@/ts/game'
import { useLocalStorage } from 'usehooks-ts'
import { addDays, addMonths, parseISO } from 'date-fns'
import { notification } from '@/contexts/GlobalContext'
import { defaultNewGame } from '@/utils/defaultValue'

interface GamesStore {
  games: Array<GameI>
}

interface Storage {
  updatedGames: GameI[]
  originalGames: GameI[]
}

function deserializer(value: string) {
  const parsedGames = JSON.parse(value) as {
    updatedGames: GameI[]
    originalGames: GameI[]
  }
  parsedGames.updatedGames.forEach((game) => {
    game.start = new Date(game.start)
    game.end = new Date(game.end)
    game.changeLogs?.forEach((log) => {
      log.createdAt = new Date(log.createdAt)
    })
  })
  parsedGames.originalGames.forEach((game) => {
    game.start = new Date(game.start)
    game.end = new Date(game.end)
    game.changeLogs?.forEach((log) => {
      log.createdAt = new Date(log.createdAt)
    })
  })
  return parsedGames
}

const RecentlyPlayed: React.FC = () => {
  const prevValues = useRef<GamesStore>({ games: [] })
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm<GamesStore>()
  const [savedGames, setSavedGames] = useLocalStorage<Storage | undefined>(
    'games',
    undefined,
    { deserializer },
  )
  const [bannedGames, setBannedGames] = useLocalStorage<Record<number, string>>(
    'banned-games',
    {},
  )

  useEffect(() => {
    const nextDropCheck = localStorage.getItem('nextDropCheck')
    let mustCheck = true
    if (nextDropCheck) {
      if (parseISO(nextDropCheck) > new Date()) {
        mustCheck = false
      }
    }
    if (mustCheck) {
      localStorage.setItem(
        'nextDropCheck',
        addMonths(new Date(), 1).toISOString(),
      )
      message.info('Checking for games to drop')
      async function dropGames() {
        await query('games/drop')
      }
      dropGames()
    }
  }, [])

  function loadFromLocalStorage() {
    if (savedGames) {
      form.setFieldsValue({ games: savedGames.updatedGames })
      prevValues.current = {
        games: savedGames.originalGames,
      }
    }
  }

  async function loadFromSteam() {
    setLoading(true)
    const remainingKeys = Object.keys(bannedGames).filter((key) => {
      return parseISO(bannedGames[Number(key)]) < new Date()
    })
    for (const key of remainingKeys) {
      delete bannedGames[Number(key)]
    }
    setBannedGames(bannedGames)
    const games = await getRecentlyPlayed(Object.keys(bannedGames).map(Number))
    setLoading(false)
    form.setFieldValue('games', games.updatedGames)
    setSavedGames(games)
    prevValues.current = {
      games: games.originalGames,
    }
  }

  function handleBan(appid: number) {
    bannedGames[appid] = addDays(new Date(), 15).toISOString()
    setBannedGames(bannedGames)
  }

  const handleSubmit = async (values: GamesStore) => {
    if (!values.games?.length) {
      notification.error({
        message: 'No data to submit',
        description: 'Add some games',
      })
      return
    }
    setSavedGames({
      updatedGames: values.games,
      originalGames: prevValues.current.games,
    })
    sendGameChangelogs(values)
  }

  function handleSubmitFailed(errorInfo: ValidateErrorEntity<GamesStore>) {
    notification.error({
      message: 'Errors in form',
      description: errorInfo.errorFields
        .map(
          (error) =>
            `${error.errors[0]} on field ${JSON.stringify(error.name[0])}`,
        )
        .join('\n'),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function sendGameChangelogs(values: GamesStore) {
    const notificationLogger = new NotificationLogger(
      'games-upsert',
      'updating games',
      'info',
      values.games.length,
    )
    const changedValues = getChangedValues(prevValues.current, values)
    for (let i = 0; i < changedValues?.games.create.length; i++) {
      try {
        await query('games/create', changedValues?.games.create[i])
        notificationLogger.success({
          type: 'success',
          title: `created ${changedValues?.games.create[i].name}`,
        })
        await wait(500)
      } catch (e: unknown) {
        if (e instanceof Error) {
          const m = e.message
          notificationLogger.error({
            type: 'error',
            title: `creating ${changedValues?.games.create[i].name}: ${m}`,
          })
        }
      }
    }
    for (let i = 0; i < changedValues?.games.update.length; i++) {
      try {
        await query('games/update', changedValues?.games.update[i])
        notificationLogger.success({
          type: 'success',
          title: `updated ${changedValues?.games.update[i].id}`,
        })
        await wait(500)
      } catch (e: unknown) {
        if (e instanceof Error) {
          const m = e.message
          notificationLogger.error({
            type: 'error',
            title: `updating ${changedValues?.games.update[i].id}: ${m}`,
          })
        }
      }
    }
    setLoading(false)
  }

  return (
    <Flex vertical gap="middle">
      <Flex gap="middle" wrap>
        <Button type="primary" onClick={loadFromSteam}>
          Load from steam
        </Button>
        {!savedGames && (
          <Button onClick={loadFromLocalStorage}>
            Load from local storage
          </Button>
        )}
      </Flex>
      <Form
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={handleSubmitFailed}
        noValidate
        layout="vertical"
        id="game-form"
      >
        <Form.List name="games">
          {(fields, { add, remove }, { errors }) => {
            return (
              <Row>
                {fields.map(({ key, name }) => {
                  return (
                    <Col span={24} key={key}>
                      <Form.Item name={name}>
                        <InputGame
                          fieldName={name}
                          remove={() => remove(name)}
                          ban={handleBan}
                        />
                      </Form.Item>
                    </Col>
                  )
                })}
                <Col span={24}>
                  <Form.ErrorList errors={errors} />
                  <Button
                    type="default"
                    onClick={() => add(defaultNewGame)}
                    icon={<PlusCircleFilled />}
                  >
                    Add new game
                  </Button>
                </Col>
              </Row>
            )
          }}
        </Form.List>
      </Form>
      <Affix offsetBottom={0}>
        <Flex gap="middle" className="p-middle blur">
          <Link to="/">
            <Button disabled={loading}>Cancel</Button>
          </Link>
          <Button
            type="primary"
            disabled={loading}
            loading={loading}
            htmlType="submit"
            form="game-form"
          >
            Submit
          </Button>
        </Flex>
      </Affix>
    </Flex>
  )
}

export default RecentlyPlayed
