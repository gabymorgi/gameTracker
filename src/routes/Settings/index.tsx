import { Button, Card, Col, Form, Input, Row } from 'antd'
import { Store } from 'antd/lib/form/interface'
import styled from 'styled-components'
import { GlobalContext } from '@/contexts/GlobalContext'
import { FlexSection } from '@/components/ui/Layout'
import { InputTag } from '@/components/Form/InputTag'
import { Tag } from '@/components/ui/Tags'
import { useContext, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { EndPoint } from '@/ts'
import { ArrowLeftOutlined } from '@ant-design/icons'
import gameTags from '@/back/gameTags.json'
import { Clustering, createGraph, parseGameTags } from '@/utils/tagClustering'
import Cluster from '@/components/ui/Cluster'

const CloseButton = styled.div`
  cursor: pointer;
`

const Settings: React.FC = () => {
  const refCluster = useRef<HTMLDivElement>(null)
  const { tags, states, loading, upsertVal , deleteVal } =
    useContext(GlobalContext)
  const handleSubmit = async (
    collection: EndPoint.TAGS | EndPoint.STATES,
    values: Store
  ) => {
    upsertVal(collection, { id: values.name, hue: values.hue })
  }
  const handleDelete = async (
    collection: EndPoint.TAGS | EndPoint.STATES,
    id: string
  ) => {
    deleteVal(collection, id)
  }

  const clusters = useMemo(() => {
    
    const games = parseGameTags(gameTags as any)

    const graph = createGraph(games, false)

    console.log(graph)

    const cluster = Clustering.hierarchicalClusteringTree(graph, 0.01)
    cluster.assignColors(0, 300)

    return cluster
  }, [])

  console.log(clusters)

  return (
    <FlexSection gutter={16} direction='column' className='p-16'>
      <div>
        <Link to='/'><ArrowLeftOutlined /> Back to home</Link>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tags">
            <div className='flex flex-col gap-16'>
              <div className='flex flex-wrap gap-16'>
                {tags &&
                  Object.entries(tags).map(([name, value]) => (
                    <Tag key={name} hue={value}>
                      {name}{' '}{(value)}
                      <CloseButton
                        onClick={() =>
                          handleDelete(EndPoint.TAGS, name)
                        }
                      >
                        x
                      </CloseButton>
                    </Tag>
                  ))}
              </div>
              <Form
                onFinish={(values) =>
                  handleSubmit(EndPoint.TAGS, values)
                }
                layout='horizontal'
              >
                <Form.Item
                  label='Name'
                  name='name'
                  rules={[{ required: true, message: 'Please input a name' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label='Hue' name='hue' className='flex-grow'>
                  <InputTag />
                </Form.Item>
                <Button
                  disabled={loading}
                  loading={loading}
                  htmlType='submit'
                >
                  Add
                </Button>
              </Form>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="States">
            <div className='flex flex-col gap-16'>
              <div className='flex flex-wrap gap-16'>
                {states &&
                  Object.entries(states).map(([name, value]) => (
                    <Tag key={name} hue={value}>
                      {name}{' '}{(value)}
                      <CloseButton
                        onClick={() =>
                          handleDelete(EndPoint.STATES, name)
                        }
                      >
                        x
                      </CloseButton>
                    </Tag>
                  ))}
              </div>
              <Form
                onFinish={(values) =>
                  handleSubmit(EndPoint.STATES, values)
                }
                layout='horizontal'
              >
                <Form.Item
                  label='Name'
                  name='name'
                  rules={[{ required: true, message: 'Please input a name' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label='Hue' name='hue' className='flex-grow'>
                  <InputTag />
                </Form.Item>
                <Button
                  disabled={loading}
                  loading={loading}
                  htmlType='submit'
                >
                  Add
                </Button>
              </Form>
            </div>
          </Card>
        </Col>
        <Col ref={refCluster} span={24} style={{
          // height same as innerWidth to make it a square
          height: `${refCluster.current?.offsetWidth}px`,
        }}>
          <Cluster cluster={clusters} />
        </Col>
      </Row>
    </FlexSection>
  )
}

export default Settings
