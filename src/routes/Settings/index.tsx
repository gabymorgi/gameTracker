import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  notification,
} from 'antd'
import { Store } from 'antd/lib/form/interface'
import { GlobalContext } from '@/contexts/GlobalContext'
import { InputTag } from '@/components/Form/InputTag'
import { Tag } from '@/components/ui/Tags'
import { useContext, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EndPoint, GameTagI } from '@/ts'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { CirclePacking } from '@/components/ui/CirclePacking'
import { getClusteringData } from '@/utils/tagClustering'
import HierarchicalEdgeBundling from '@/components/ui/HierarchicalEdgeBundling'
import { Options, query } from '@/hooks/useFetch'

const Settings: React.FC = () => {
  const { tags, states, loading, upsertVal, deleteVal, refresh } =
    useContext(GlobalContext)
  const [gameTags, setGameTags] = useState<GameTagI[]>()
  const [loadingGameTags, setLoadingGameTags] = useState(false)

  const handleSubmit = async (
    collection: EndPoint.TAGS | EndPoint.STATES,
    values: Store,
  ) => {
    upsertVal(collection, { id: values.name, hue: values.hue })
  }

  const handleDelete = async (
    collection: EndPoint.TAGS | EndPoint.STATES,
    id: string,
  ) => {
    deleteVal(collection, id)
  }

  const fetchTags = async () => {
    setLoadingGameTags(true)
    const res = await query<GameTagI[]>(EndPoint.GAME_TAGS)
    setGameTags(res)
    setLoadingGameTags(false)
  }

  const updateTagColors = async () => {
    if (!clusteringData) return
    setLoadingGameTags(true)
    const tagNodes = clusteringData.circlePackaging.getLeafNodes()
    for (let i = 0; i < tagNodes.length; i += 10) {
      await query(
        EndPoint.TAGS,
        Options.POST,
        {},
        tagNodes.slice(i, i + 10).map((node) => ({
          id: node.name,
          hue: node.color,
        })),
      )
      notification.info({
        message: `Updated ${i} tags out of ${tagNodes.length}`,
      })
    }
    await refresh()
    setLoadingGameTags(false)
  }

  const clusteringData = useMemo(() => {
    if (!tags || !gameTags) return
    return getClusteringData(gameTags, tags)
  }, [gameTags, tags])

  // console.log(JSON.stringify(clusteringData))

  return (
    <div className="flex flex-col gap-16 p-16">
      <div>
        <Link to="/">
          <ArrowLeftOutlined /> Back to home
        </Link>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tags">
            <div className="flex flex-col gap-16">
              <div className="flex flex-wrap gap-16">
                {tags &&
                  Object.entries(tags).map(([name, value]) => (
                    <Tag key={name} $hue={value}>
                      {name} {value}
                      <Popconfirm
                        title="Delete tag"
                        description="Are you sure to delete this tag?"
                        onConfirm={() => handleDelete(EndPoint.TAGS, name)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <div className="pointer">x</div>
                      </Popconfirm>
                    </Tag>
                  ))}
              </div>
              <Form
                onFinish={(values) => handleSubmit(EndPoint.TAGS, values)}
                layout="horizontal"
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please input a name' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Hue" name="hue" className="flex-grow">
                  <InputTag />
                </Form.Item>
                <Button disabled={loading} loading={loading} htmlType="submit">
                  Add
                </Button>
              </Form>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="States">
            <div className="flex flex-col gap-16">
              <div className="flex flex-wrap gap-16">
                {states &&
                  Object.entries(states).map(([name, value]) => (
                    <Tag key={name} $hue={value}>
                      {name} {value}
                      <Popconfirm
                        title="Delete tag"
                        description="Are you sure to delete this tag?"
                        onConfirm={() => handleDelete(EndPoint.STATES, name)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <div className="pointer">x</div>
                      </Popconfirm>
                    </Tag>
                  ))}
              </div>
              <Form
                onFinish={(values) => handleSubmit(EndPoint.STATES, values)}
                layout="horizontal"
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please input a name' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Hue" name="hue" className="flex-grow">
                  <InputTag />
                </Form.Item>
                <Button disabled={loading} loading={loading} htmlType="submit">
                  Add
                </Button>
              </Form>
            </div>
          </Card>
        </Col>
        {clusteringData ? (
          <>
            <Col span={24}>
              <Card title="Circle Packing">
                <CirclePacking data={clusteringData.circlePackaging} />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title="Hierarchical Edge Bundling"
                extra={<Button onClick={updateTagColors}>Update Tags</Button>}
              >
                <HierarchicalEdgeBundling data={clusteringData.edgeBundling} />
              </Card>
            </Col>
          </>
        ) : (
          <Col span={24}>
            <Card title="Clustering">
              <Button
                disabled={loadingGameTags}
                loading={loadingGameTags}
                onClick={fetchTags}
              >
                Cluster
              </Button>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default Settings
