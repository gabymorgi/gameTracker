import { Affix, Button, Col, Row } from 'antd'
import ChangelogCard from './ChangelogCard'
import { useQuery } from '@/hooks/useCollectionData'
import { useState } from 'react'
import ChangelogForm from './ChangelogForm'
import { Link } from 'react-router-dom'
import Spin from '@/components/ui/Spin'

interface ChangeLogI {
  id: string
  achievements: number
  createdAt: number
  hours: number
  state: string
  gameId: string
  gameName: string
}

const Changelogs = () => {
  const [addition, setAddition] = useState(false)
  const {
    data,
    getNextPage,
    addItem,
    editItem,
    delItem,
    isLastPage,
    isLoading,
  } = useQuery<ChangeLogI>(
    // CollectionType.Changelogs,
    undefined,
    undefined,
    { field: 'createdAt', direction: 'desc' }
  )

  const addChangelog = async (values: any) => {
    await addItem(values)
  }

  const editChangelog = (values: any, id?: string) => {
    editItem(id!, values)
  }

  const deleteChangelog = (id: string) => {
    delItem(id)
  }

  return (
    <div className='flex flex-col gap-16 p-16'>
      <div className='flex justify-between items-center'>
        <Button>
          <Link to='/'>Go Back</Link>
        </Button>
        <h1>Changelogs</h1>
        <Button onClick={() => setAddition(true)} type='primary'>
          Add changelog
        </Button>
      </div>
      {addition ? (
        <ChangelogForm changelogId='' onFinish={addChangelog} />
      ) : null}
      <Spin size='large' spinning={isLoading}>
        <Row gutter={[16, 16]}>
          {data?.map((changelog) => (
            <Col key={changelog.id} xs={24} md={12} lg={8} xl={6}>
              <ChangelogCard
                changelog={changelog}
                onFinish={editChangelog}
                onDelete={deleteChangelog}
              />
            </Col>
          ))}
          {!isLastPage ? (
            <Col span={24}>
              <Button onClick={() => getNextPage()} type="primary">Load more</Button>
            </Col>
          ) : undefined}
        </Row>
      </Spin>
      <Affix offsetBottom={16}>
        <div className='flex justify-end'>
          <Button
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }}
          >
            scroll to top
          </Button>
        </div>
      </Affix>
    </div>
  )
}

export default Changelogs
