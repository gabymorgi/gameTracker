import { Button, Card, Col, Flex, Form, Input, Popconfirm, Row } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { GlobalContext, TagType } from '@/contexts/GlobalContext'
import { InputTag } from '@/components/Form/InputTag'
import { Tag } from '@/components/ui/Tags'
import { useContext, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { CirclePacking } from '@/components/ui/CirclePacking'
import { getClusteringData } from '@/utils/tagClustering'
import HierarchicalEdgeBundling from '@/components/ui/HierarchicalEdgeBundling'
import { query } from '@/hooks/useFetch'
import { ApiGetGameTags } from '@/ts/api'
import { notification } from '@/contexts/GlobalContext'

const Settings: React.FC = () => {
  const { tags, states, loading, upsertVal, deleteVal, refresh } =
    useContext(GlobalContext)
  const [gameTags, setGameTags] = useState<ApiGetGameTags[]>()
  const [loadingGameTags, setLoadingGameTags] = useState(false)

  const handleSubmit = async (type: TagType, values: Store) => {
    upsertVal(type, { id: values.name, hue: values.hue })
  }

  const handleDelete = async (type: TagType, id: string) => {
    deleteVal(type, id)
  }

  const fetchTags = async () => {
    setLoadingGameTags(true)
    const res = await query('tags/getGameTags')
    setGameTags(res)
    setLoadingGameTags(false)
  }

  const updateTagColors = async () => {
    if (!clusteringData) return
    setLoadingGameTags(true)
    const tagNodes = clusteringData.circlePackaging.getLeafNodes()
    for (let i = 0; i < tagNodes.length; i += 10) {
      await query('tags/upsert', {
        type: 'tags',
        data: tagNodes.slice(i, i + 10).map((node) => ({
          id: node.name,
          hue: node.color,
        })),
      })
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

  return (
    <Flex vertical gap="middle" className="p-middle">
      <div>
        <Link to="/">
          <ArrowLeftOutlined /> Back to home
        </Link>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tags">
            <Flex vertical gap="middle">
              <Flex wrap gap="middle">
                {tags &&
                  Object.entries(tags).map(([name, value]) => (
                    <Tag size="small" key={name} $hue={value} gap="small">
                      <span>{name}</span>
                      <span>{value}</span>
                      <Popconfirm
                        title="Delete tag"
                        description="Are you sure to delete this tag?"
                        onConfirm={() => handleDelete('tags', name)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <div className="pointer">x</div>
                      </Popconfirm>
                    </Tag>
                  ))}
              </Flex>
              <Form
                onFinish={(values) => handleSubmit('tags', values)}
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
            </Flex>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="States">
            <Flex vertical gap="middle">
              <Flex wrap gap="middle">
                {states &&
                  Object.entries(states).map(([name, value]) => (
                    <Tag size="small" key={name} $hue={value} gap="small">
                      {name} {value}
                      <Popconfirm
                        title="Delete tag"
                        description="Are you sure to delete this tag?"
                        onConfirm={() => handleDelete('states', name)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <div className="pointer">x</div>
                      </Popconfirm>
                    </Tag>
                  ))}
              </Flex>
              <Form
                onFinish={(values) => handleSubmit('states', values)}
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
            </Flex>
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
    </Flex>
  )
}

export default Settings
