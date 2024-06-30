import React, { useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'
import {
  Button,
  Col,
  Form,
  Layout,
  Row,
  Pagination,
  Upload,
  Affix,
  message,
  Flex,
} from 'antd'
import { SteamGame, getRecentlyPlayed } from '@/utils/steam'
import { Link } from 'react-router-dom'
import { InputGame } from '@/components/Form/InputGame'
import { PlusCircleFilled, UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/es/upload'
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
import ScrollToTop from '@/components/ui/ScrollToTop'

interface GamesStore {
  games: Array<GameI>
}

interface Storage {
  updatedGames: GameI[]
  originalGames: GameI[]
}

const itemsPerPage = 12

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
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm<GamesStore>()
  const [savedGames, setSavedGames, removeSavedGames] = useLocalStorage<
    Storage | undefined
  >('games', undefined, { deserializer })
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

  function handleCSVFile(info: UploadChangeParam) {
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result
        if (!text) {
          throw new Error('No file')
        }

        interface CSVGameI {
          start: string
          end: string
          extraPlayedTime: string
          playedTime: string
          tags?: string
        }
        Papa.parse<CSVGameI>(text as string, {
          header: true,
          complete: function (results) {
            form.setFieldValue(
              'games',
              results.data.map((game) => ({
                ...game,
                tags: game.tags?.split(','),
                start: game.start,
                end: game.end,
                extraPlayedTime: Number(game.extraPlayedTime),
                playedTime: Number(game.playedTime),
              })) as unknown as SteamGame[],
            )
          },
        })
      }
      if (!info.file.originFileObj) throw new Error('No file')
      reader.readAsText(info.file.originFileObj) // <-- Lee el archivo como texto
    } catch (e: unknown) {
      if (e instanceof Error) {
        notification.error({
          message: 'File upload failed',
          description: e.message,
        })
      }
    }
  }

  function handleJSONFile(info: UploadChangeParam) {
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result
        if (!text) return
        const games = (await JSON.parse(text as string)) as SteamGame[]
        form.setFieldValue('games', games)
      }
      if (!info.file.originFileObj) throw new Error('No file')
      reader.readAsText(info.file.originFileObj) // <-- Lee el archivo como texto
    } catch (e: unknown) {
      if (e instanceof Error) {
        notification.error({
          message: 'File upload failed',
          description: e.message,
        })
      }
    }
  }

  function saveAsJSON() {
    const values = form.getFieldsValue()
    const json = JSON.stringify(values.games)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'games.json'
    a.click()
  }

  function handleBan(appid: number) {
    bannedGames[appid] = addDays(new Date(), 15).toISOString()
    setBannedGames(bannedGames)
  }

  const handleSubmit = async (values: GamesStore) => {
    // validate every game, because ant only validates visible fields
    const errors = []
    for (let i = 0; i < values.games.length; i++) {
      const game = values.games[i]
      if (!game.name) {
        errors.push({
          message: 'Name is required',
          game: game.appid || game.name,
          page: i / itemsPerPage + 1,
        })
      }
      if (!game.platform) {
        errors.push({
          message: 'Platform is required',
          game: game.appid || game.name,
          page: i / itemsPerPage + 1,
        })
      }
      if (!game.start) {
        errors.push({
          message: 'Start is required',
          game: game.appid || game.name,
          page: i / itemsPerPage + 1,
        })
      }
      if (!game.end) {
        errors.push({
          message: 'End is required',
          game: game.appid || game.name,
          page: i / itemsPerPage + 1,
        })
      }
      if (game.start > game.end) {
        errors.push({
          message: 'Start cannot be greater than end',
          game: game.appid || game.name,
          page: i / itemsPerPage + 1,
        })
      }
      if (!game.stateId) {
        errors.push({
          message: 'State is required',
          game: game.appid || game.name,
          page: i / itemsPerPage + 1,
        })
      }
      if (!game.tags?.length) {
        errors.push({
          message: 'Tags are required',
          game: game.appid || game.name,
          page: i / itemsPerPage + 1,
        })
      }
      if (game.score && !game.score.finalMark) {
        errors.push({
          message: 'Final mark is required',
          game: game.appid || game.name,
          page: i / itemsPerPage + 1,
        })
      }
    }
    if (errors.length) {
      notification.error({
        message: 'Errors in form',
        description: (
          <div>
            {errors.map((error) => (
              <div key={error.game}>
                {error.message} for game {error.game} on page {error.page}
              </div>
            ))}
          </div>
        ),
      })
      setCurrentPage(errors[0].page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

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
    const errorChangelogs = []
    const notificationLogger = new NotificationLogger(
      'games-upsert',
      'updating games',
      'info',
      values.games.length,
    )
    const changedValues = getChangedValues(prevValues.current, values)
    const gamesToSend = [
      ...changedValues?.games.create,
      ...changedValues?.games.update,
    ]
    for (let i = 0; i < gamesToSend.length; i++) {
      try {
        if (gamesToSend[i].id) {
          await query('games/update', gamesToSend[i])
        } else {
          await query('games/create', gamesToSend[i])
        }
        notificationLogger.success({
          type: 'success',
          title: `${values.games[i].name}`,
        })
      } catch (e: unknown) {
        if (e instanceof Error) {
          const m = e.message
          notificationLogger.error({
            type: 'error',
            title: `${values.games[i].name}: ${m}`,
          })
        }
        errorChangelogs.push(gamesToSend[i])
      }
      await wait(500)
    }
    form.setFieldsValue({ games: errorChangelogs })
    removeSavedGames()
    setLoading(false)
  }

  return (
    <Layout>
      <Layout.Content>
        <Flex vertical gap="middle">
          <Flex gap="middle">
            <Upload
              name="file"
              accept=".csv"
              showUploadList={false}
              customRequest={() => {}} // disable default upload
              onChange={handleCSVFile}
            >
              <Button icon={<UploadOutlined />}>Upload CSV</Button>
            </Upload>
            <Upload
              name="file"
              accept=".json"
              showUploadList={false}
              customRequest={() => {}} // disable default upload
              onChange={handleJSONFile}
            >
              <Button icon={<UploadOutlined />}>Upload JSON</Button>
            </Upload>
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
                // const totalPages = Math.ceil(fields.length / itemsPerPage);
                const currentFields = fields.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage,
                )

                return (
                  <Row>
                    {currentFields.map(({ key, name }) => {
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
                    {fields.length > itemsPerPage && (
                      <Col span={24}>
                        <Pagination
                          current={currentPage}
                          total={fields.length}
                          pageSize={itemsPerPage}
                          onChange={(page) => {
                            setCurrentPage(page)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                        />
                      </Col>
                    )}
                  </Row>
                )
              }}
            </Form.List>
          </Form>
        </Flex>
      </Layout.Content>
      <Affix offsetBottom={16}>
        <Flex gap="middle" justify="space-between" className="p-middle blur">
          <ScrollToTop />
          <Flex gap="middle">
            <Button disabled={loading} loading={loading} onClick={saveAsJSON}>
              Save for later
            </Button>
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
        </Flex>
      </Affix>
    </Layout>
  )
}

export default RecentlyPlayed
