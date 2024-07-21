import { Button, Flex, Popconfirm, Space } from 'antd'
import { formatPlayedTime, formattedDate } from '@/utils/format'
import {
  DeleteFilled,
  EditFilled,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons'
import Icon from '@mdi/react'
import { mdiSeal } from '@mdi/js'
import { ChangelogsGameI } from '@/ts/game'

interface ChangelogItemPropsI {
  defaultIsEdit?: boolean
  changelog: ChangelogsGameI['changeLogs'][number]
  isFirst?: boolean
  isLast?: boolean
  onEdit: () => void
  onDelete: () => void
  onMergeUp: () => void
  onMergeDown: () => void
}

const ChangelogItem = (props: ChangelogItemPropsI) => {
  return (
    <Flex
      gap="middle"
      justify="space-between"
      align="center"
      className="w-full"
    >
      <Flex gap="middle">
        <span>{formattedDate(props.changelog.createdAt)}</span>
        <Flex gap="small" align="center">
          <span>{props.changelog.achievements}</span>
          <Icon path={mdiSeal} size="16px" />
        </Flex>
        <span>{props.changelog.stateId}</span>
        <span>{formatPlayedTime(props.changelog.hours)}</span>
      </Flex>
      <Space.Compact>
        <Popconfirm
          title="Merge changelog"
          description="Are you sure to DELETE and MERGE UP this changelog?"
          onConfirm={props.onMergeUp}
          okText="Yes"
          cancelText="No"
          disabled={props.isFirst}
        >
          <Button
            type="text"
            icon={<VerticalAlignTopOutlined />}
            disabled={props.isFirst}
          />
        </Popconfirm>
        <Popconfirm
          title="Merge changelog"
          description="Are you sure to DELETE and MERGE DOWN this changelog?"
          onConfirm={props.onMergeDown}
          okText="Yes"
          cancelText="No"
          disabled={props.isLast}
        >
          <Button
            type="text"
            icon={<VerticalAlignBottomOutlined />}
            disabled={props.isLast}
          />
        </Popconfirm>
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
  )
}

export default ChangelogItem
