import {
  Button,
  Card,
  Col,
  Row,
} from 'antd'
import { useState } from 'react'
import { Statistic } from '@/components/ui/Statistics'
import { formatPlayedTime, formattedDate } from '@/utils/format'
import { DeleteFilled, EditFilled, SaveOutlined } from '@ant-design/icons'
import { numberToDate } from '@/utils/format'
import ChangelogForm from './ChangelogForm'
import { ChangelogI } from '@/ts'

interface ChangelogCardI {
  changelog: ChangelogI
  onFinish: (values: any, id?: string) => void
  onDelete: (id: string) => void
}

const ChangelogCard = (props: ChangelogCardI) => {
  const [isEdit, setIsEdit] = useState(false)

  function handleFinish(values: any) {
    props.onFinish(values, props.changelog.id)
    setIsEdit(!isEdit)
  }

  return (
    <Card
      key={props.changelog.createdAt}
      title={
        <div>
          <div>{props.changelog.id}</div>
          <div>
            <b>{props.changelog.gameName || props.changelog.gameId}</b>
          </div>
        </div>
      }
      actions={isEdit ? [
        <Button
          key="cancel"
          icon={<EditFilled />}
          onClick={() => setIsEdit(!isEdit)}
        >
          Cancel
        </Button>,
        <Button
          key="save"
          icon={<SaveOutlined />}
          htmlType='submit'
          form='changelog-form'
          type='primary'
        >
          Save
        </Button>,
      ] : [
        <Button
          key="Edit"
          icon={<EditFilled />}
          onClick={() => setIsEdit(!isEdit)}
        >
          Edit
        </Button>,
        <Button
          key="Delete"
          icon={<DeleteFilled />}
          onClick={() => props.onDelete(props.changelog.id)}
          danger
        >
          Delete
        </Button>,
      ]}
    >
      {isEdit ? (
        <ChangelogForm
          changelogId={props.changelog.id}
          changelog={props.changelog}
          onFinish={handleFinish}
        />
      ) : (
        <Row>
          <Col span={12}>
            <Statistic
              label='createdAt'
              value={formattedDate(numberToDate(props.changelog.createdAt))}
            />
          </Col>
          <Col span={12}>
            <Statistic label='hours' value={formatPlayedTime(props.changelog.hours)} />
          </Col>
          <Col span={12}>
            <Statistic
              label='achievements'
              value={props.changelog.achievements}
            />
          </Col>
          <Col span={12}>
            <Statistic label='state' value={props.changelog.state} />
          </Col>
        </Row>
      )}
    </Card>
  )
}

export default ChangelogCard
