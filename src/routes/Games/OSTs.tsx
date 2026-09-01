import { useQuery } from '@/hooks/useFetch'
import { GameImg } from '@/styles/TableStyles'
import { Card, Col, Empty, Row, Skeleton } from 'antd'
import { useEffect } from 'react'

const OSTs: React.FC = () => {
  const { data, fetchData, loading } = useQuery('games/osts')

  useEffect(() => {
    fetchData(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <Skeleton active />

  if (!data?.length) return <Empty description="No OSTs found" />

  return (
    <Row gutter={[16, 16]}>
      {data.map((game) => (
        <Col key={game.id} xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card size="small">
            <GameImg
              title={game.name}
              href={game.ost}
              width="100%"
              height="90px"
              className="object-cover"
              src={game.imageUrl}
              alt={`${game.name} header`}
              errorComponent={
                <a href={game.ost} target="_blank" rel="noopener noreferrer">
                  {game.name}
                </a>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default OSTs
