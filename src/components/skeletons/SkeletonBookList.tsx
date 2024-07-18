import { Col, Row } from 'antd'
import SkeletonBook from './SkeletonBook'

function SkeletonBookList() {
  return (
    <Row gutter={[16, 16]}>
      {Array.from({ length: 12 }).map((_, index) => (
        <Col xs={24} sm={12} lg={8} xl={6} xxl={4} key={index}>
          <SkeletonBook />
        </Col>
      ))}
    </Row>
  )
}

export default SkeletonBookList
