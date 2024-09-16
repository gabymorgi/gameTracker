import { Button, Card, Col, Flex, Form, Input, Popconfirm, Row } from 'antd'
import { GlobalContext } from '@/contexts/GlobalContext'
import { InputTag } from '@/components/Form/InputTag'
import { Tag } from '@/components/ui/Tags'
import { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { CirclePacking } from '@/components/ui/CirclePacking'
import { getClusteringData } from '@/utils/tagClustering'
import HierarchicalEdgeBundling from '@/components/ui/HierarchicalEdgeBundling'
import { useQuery } from '@/hooks/useFetch'
import { notification } from '@/contexts/GlobalContext'

const Settings: React.FC = () => {
  const { tags, loading, upsertVal, deleteVal, refresh } =
    useContext(GlobalContext)
  const {
    data: gameTags,
    fetchData,
    loading: loadingGameTags,
  } = useQuery('tags/getGameTags')

  function fetchTags() {
    fetchData(undefined)
  }

  const updateTagColors = async () => {
    if (!clusteringData) return
    const tagNodes = clusteringData.circlePackaging.getLeafNodes()
    for (let i = 0; i < tagNodes.length; i++) {
      await upsertVal({
        id: tagNodes[i].name,
        hue: tagNodes[i].color,
      })
      notification.info({
        message: `Updated ${i} tags out of ${tagNodes.length}`,
      })
    }
    refresh(undefined)
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
        <Col span={24}>
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
                        onConfirm={() => deleteVal(name)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <div className="pointer">x</div>
                      </Popconfirm>
                    </Tag>
                  ))}
              </Flex>
              <Form onFinish={upsertVal} layout="horizontal">
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
