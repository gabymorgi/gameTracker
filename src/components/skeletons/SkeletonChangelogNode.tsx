import { Card, Col, Divider, Flex, Row, Skeleton } from 'antd'
import Icon from '@mdi/react'
import { mdiClock, mdiSeal } from '@mdi/js'
import { FullHeightCard } from '@/styles/TableStyles'

export function SkeletonChangelogItem() {
  return (
    <FullHeightCard size="small">
      <Flex vertical gap="small" align="stretch" className="h-full">
        <Skeleton.Image style={{ width: 200 }} active />
        <Flex justify="space-between" align="center" className="text-center">
          <Skeleton.Button style={{ width: 40 }} size="small" active />
          <Divider type="vertical" />
          <span>of</span>
          <Divider type="vertical" />
          <Skeleton.Button style={{ width: 40 }} size="small" active />
        </Flex>
        <Skeleton.Button block size="small" active />
      </Flex>
    </FullHeightCard>
  )
}

interface Props {
  amount: number
}

export function SkeletonChangelogList(props: Props) {
  return (
    <Card
      size="small"
      title={<Skeleton.Button style={{ width: 100 }} size="small" active />}
      extra={
        <Flex gap="small" align="center">
          <Skeleton.Button style={{ width: 65 }} size="small" active />
          <Icon path={mdiSeal} size="16px" />
          <Divider type="vertical" />
          <Skeleton.Button style={{ width: 65 }} size="small" active />
          <Icon path={mdiClock} size="16px" />
        </Flex>
      }
    >
      <Row gutter={[16, 16]}>
        {Array.from({ length: props.amount }).map((_, i) => (
          <Col xs={12} sm={8} lg={6} xl={4} xxl={3} key={i}>
            <SkeletonChangelogItem />
          </Col>
        ))}
      </Row>
    </Card>
  )
}
