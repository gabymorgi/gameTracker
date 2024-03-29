import React, { useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'
import {
  App,
  Button,
  Col,
  Form,
  Layout,
  Row,
  Pagination,
  Upload,
  Affix,
} from 'antd'
import {
  SteamGame,
  getImgUrl,
  getRecentlyPlayedGamesUrl,
  parseRecentlyPlayedJSON,
  steamRecentlyPlayedI,
} from '@/back/steamApi'
import { FormGameI } from '@/ts/index'
import { Link } from 'react-router-dom'
import IframeInput from '@/components/Form/IframeInput'
import { InputGame } from '@/components/Form/InputGame'
import { PlusCircleFilled, UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/es/upload'
import { ValidateErrorEntity } from 'rc-field-form/lib/interface'
import { query } from '@/hooks/useFetch'
import { NotificationLogger } from '@/utils/notification'
import { getChangedValues } from '@/utils/getChangedValues'

interface GamesStore {
  games: Array<FormGameI>
}

const itemsPerPage = 12

export const RecentlyPlayed: React.FC = () => {
  const { notification } = App.useApp()
  const prevValues = useRef<GamesStore>({ games: [] })
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm<GamesStore>()

  useEffect(() => {
    const games = localStorage.getItem('games')
    if (games) {
      const parsedGames = JSON.parse(games) as {
        updatedGames: FormGameI[]
        originalGames: FormGameI[]
      }
      form.setFieldsValue({ games: parsedGames.updatedGames })
      prevValues.current = {
        games: parsedGames.originalGames,
      }
    }
  }, [form])

  const completeWithSteamData = async (games: SteamGame[]) => {
    try {
      setLoading(true)
      const completedGames = await parseRecentlyPlayedJSON(games, notification)
      form.setFieldValue('games', completedGames.updatedGames)
      localStorage.setItem('games', JSON.stringify(completedGames))
      prevValues.current = {
        games: completedGames.originalGames,
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        notification.error({
          message: 'Error parsing data: ',
          description: e.message,
        })
      }
      form.setFieldValue('games', games)
    } finally {
      setLoading(false)
    }
  }

  const parseSteamData = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    try {
      if (!value) {
        throw new Error('No data to parse')
      }
      const steamData = JSON.parse(value) as steamRecentlyPlayedI
      const games: SteamGame[] = steamData.response.games.map((game) => {
        return {
          name: game.name,
          appid: game.appid,
          playedTime: game.playtime_forever,
          imageUrl: getImgUrl(game.appid),
        }
      })
      completeWithSteamData(games)
    } catch (e: unknown) {
      if (e instanceof Error) {
        notification.error({
          message: 'Error parsing data: ',
          description: e.message,
        })
      }
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
            completeWithSteamData(
              results.data.map((game) => ({
                ...game,
                tags: game.tags?.split(','),
                start: Number(game.start),
                end: Number(game.end),
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
        completeWithSteamData(games)
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
    localStorage.setItem(
      'games',
      JSON.stringify({
        updatedGames: values.games,
        originalGames: prevValues.current.games,
      }),
    )
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
      notification,
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
          await query(
            `games/update/${gamesToSend[i].id}`,
            'PUT',
            gamesToSend[i],
          )
        } else {
          await query('games/create', 'POST', gamesToSend[i])
        }
        notificationLogger.success({
          type: 'success',
          title: `${gamesToSend[i].name}`,
        })
      } catch (e: unknown) {
        if (e instanceof Error) {
          const m = e.message
          notificationLogger.success({
            type: 'error',
            title: `${gamesToSend[i].name}: ${m}`,
          })
        }
        errorChangelogs.push(gamesToSend[i])
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    form.setFieldsValue({ games: errorChangelogs })
    localStorage.removeItem('games')
    setLoading(false)
  }

  return (
    <Layout>
      <Layout.Content className="p-16">
        <div className="flex flex-col gap-16">
          <div className="flex gap-16">
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
          </div>
          <IframeInput
            text="Steam Recently Played Games data:"
            onTextReceived={parseSteamData}
            url={getRecentlyPlayedGamesUrl()}
          />
          <Form
            form={form}
            onFinish={handleSubmit}
            onFinishFailed={handleSubmitFailed}
            noValidate
            layout="vertical"
            className="p-16"
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
                  <Row gutter={[16, 16]}>
                    {currentFields.map(({ key, name }) => {
                      return (
                        <Col span={24} key={key}>
                          <Form.Item name={name}>
                            <InputGame
                              fieldName={name}
                              remove={() => remove(name)}
                            />
                          </Form.Item>
                        </Col>
                      )
                    })}
                    <Col span={24}>
                      <Form.ErrorList errors={errors} />
                      <Button
                        type="default"
                        onClick={() => add()}
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
        </div>
      </Layout.Content>
      <Layout.Footer className="flex justify-end gap-16">
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
      </Layout.Footer>
      <Affix offsetBottom={16} className="flex justify-end gap-16">
        <Button disabled={loading} loading={loading} onClick={saveAsJSON}>
          Save for later
        </Button>
      </Affix>
    </Layout>
  )
}

export default RecentlyPlayed
