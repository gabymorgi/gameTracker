import { Card, Col, Divider, Flex, Row, Skeleton } from 'antd'
import SkeletonGame from './SkeletonGame'

interface SkeletonGameMonthsProps {
  gameAmount?: number
}

function SkeletonGameMonths(props: SkeletonGameMonthsProps) {
  return (
    <Card
      size="small"
      title={<Skeleton.Input active size="small" style={{ width: 120 }} />}
      extra={
        <Flex gap="small" align="center">
          <Skeleton.Button style={{ width: 22 }} size="small" active />
          <Divider vertical />
          <Skeleton.Button style={{ width: 22 }} size="small" active />
        </Flex>
      }
    >
      <Row gutter={[16, 16]}>
        {Array.from({ length: props.gameAmount || 7 }).map((_, index) => (
          <Col xs={12} sm={8} lg={6} xl={4} xxl={3} key={index}>
            <SkeletonGame />
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default SkeletonGameMonths
