import { Button, Card, Flex, Popconfirm, Space } from 'antd'
import { formatPlayedTime, formattedDate } from '@/utils/format'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import Icon from '@mdi/react'
import { mdiSeal } from '@mdi/js'
import Img from '@/components/ui/Img'
import { Changelog } from '@/ts/api/changelogs'

interface ChangelogItemPropsI {
  defaultIsEdit?: boolean
  changelog: Changelog
  onEdit: () => void
  onDelete: () => void
}

const ChangelogItem = (props: ChangelogItemPropsI) => {
  return (
    <Card size="small">
      <Flex
        gap="middle"
        justify="space-between"
        align="center"
        className="w-full"
      >
        <Img
          height={65}
          src={props.changelog.game.imageUrl || ''}
          alt={`${props.changelog.game.name} header`}
          $errorComponent={
            <span className="font-16">{props.changelog.game.name}</span>
          }
        />
        <Flex vertical gap="middle" align="center">
          <span>{props.changelog.game.name}</span>
          <Flex gap="middle" align="center">
            <span>{formattedDate(props.changelog.createdAt)}</span>
            <Flex gap="small" align="center">
              <span>{props.changelog.achievements}</span>
              <Icon path={mdiSeal} size="16px" />
            </Flex>
            <span>{props.changelog.state}</span>
            <span>{formatPlayedTime(props.changelog.hours)}</span>
          </Flex>
        </Flex>
        <Space.Compact>
          <Button type="text" icon={<EditFilled />} onClick={props.onEdit} />
          <Popconfirm
            title="Delete changelog"
            description="Are you sure to delete this changelog?"
            onConfirm={props.onDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteFilled />} />
          </Popconfirm>
        </Space.Compact>
      </Flex>
    </Card>
  )
}

export default ChangelogItem
