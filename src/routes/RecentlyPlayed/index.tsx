import React, { useState } from 'react'
// import SteamAPI from 'steamapi'
import { App, Button, Col, Form, Layout, Row } from 'antd'
import { getRecentlyPlayedGamesUrl, parseRecentlyPlayedJSON } from '@/back/steamApi'
import { EndPoint, FormGameI, GameI } from '@/ts/index'
import { FlexSection } from '@/components/ui/Layout'
import { Link } from 'react-router-dom'
import IframeInput from '@/components/Form/IframeInput'
import { Store } from 'antd/es/form/interface'
import { InputGame } from '@/components/Form/InputGame'
import { PlusCircleFilled } from '@ant-design/icons'
import { Options, query, useLazyFetch } from '@/hooks/useFetch'

interface GamesStore {
  games: Array<FormGameI>
}

export const RecentlyPlayed: React.FC = () => {
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm<GamesStore>()

  const parseSteamData = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (!value) {
      notification.error({
        message: 'No data to parse',
        description: 'Paste the data from Steam',
      })
      return
    }
    try {
      setLoading(true)
      const games = await parseRecentlyPlayedJSON(value, notification)
      form.setFieldValue('games', games)
    } catch (e: any) {
      notification.error({
        message: 'Error parsing data: ',
        description: e.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: Store) => {
    if (!values.games?.length) {
      notification.error({
        message: 'No data to submit',
        description: 'Add some games',
      })
      return
    }
    console.log(values.games)
    await query(EndPoint.GAMES, Options.POST, {}, values.games)

    // navigate('/')
  }

  return (
    <Layout>
      <Layout.Content className='p-16'>
        <FlexSection gutter={16} direction='column'>
          <IframeInput
            text='Steam Recently Played Games data:'
            onTextReceived={parseSteamData}
            url={getRecentlyPlayedGamesUrl()}
          />
          <Form
            form={form}
            onFinish={handleSubmit}
            layout='vertical'
            className='p-16'
            id='game-form'
          >
            <Form.List name='games'>
              {(fields, { add, remove }, { errors }) => (
                <>
                  <Row gutter={[16, 16]}>
                    {fields.map(({ key, name }) => {
                      return (
                        <Col span={24} key={key}>
                          <Form.Item name={name}>
                            <InputGame fieldName={name} remove={() => remove(name)} />
                          </Form.Item>
                        </Col>
                      )
                    })}
                    <Col span={24}>
                      <Form.ErrorList errors={errors} />
                      <Button
                        type='default'
                        onClick={() => add()}
                        icon={<PlusCircleFilled />}
                      >
                        Add new game
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
          </Form>
        </FlexSection>
      </Layout.Content>
      <Layout.Footer className='flex justify-end gap-16'>
        <Link to='/'>
          <Button disabled={loading}>Cancel</Button>
        </Link>
        <Button
          type='primary'
          disabled={loading}
          loading={loading}
          htmlType='submit'
          form='game-form'
        >
          Submit
        </Button>
      </Layout.Footer>
    </Layout>
  )
}

export default RecentlyPlayed
