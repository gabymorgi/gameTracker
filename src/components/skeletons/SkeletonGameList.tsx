import { Col, Row } from 'antd'
import SkeletonGame from './SkeletonGame'

function SkeletonGameList() {
  return (
    <Row gutter={[16, 16]}>
      {Array.from({ length: 12 }).map((_, index) => (
        <Col xs={12} sm={8} lg={6} xl={6} xxl={4} key={index}>
          <SkeletonGame />
        </Col>
      ))}
    </Row>
  )
}

export default SkeletonGameList
