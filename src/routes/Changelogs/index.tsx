import { Affix, Button, Col, Row } from 'antd'
import ChangelogCard from './ChangelogCard'
import { useState } from 'react'
import ChangelogForm from './ChangelogForm'
import { Link } from 'react-router-dom'
import Spin from '@/components/ui/Spin'
import { useFetch } from '@/hooks/useFetch'
import { ChangelogI } from '@/ts'

const Changelogs = () => {
  const [addition, setAddition] = useState(false)
  const {
    data,
    loading,
    fetchData
  } = useFetch<ChangelogI[]>("changelogs")

  console.log(data)

  const addChangelog = async (values: any) => {
    console.log(values)
  }

  const editChangelog = (values: any, id?: string) => {
    console.log(values, id)
  }

  const deleteChangelog = (id: string) => {
    console.log(id)
  }

  return (
    <div className='flex flex-col gap-16'>
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
      <Spin size='large' spinning={loading}>
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
