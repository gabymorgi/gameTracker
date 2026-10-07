import { Button, Flex, Popconfirm, Space } from 'antd'
import { formatPlayedTime, formattedDate } from '@/utils/format'
import { Icon } from '@/components/ui/Icon'
import {
  mdiTrashCanOutline,
  mdiFormatVerticalAlignBottom,
  mdiFormatVerticalAlignTop,
  mdiPencilOutline,
  mdiSeal,
} from '@mdi/js'
import { Changelog } from '#prisma-browser-client'

interface ChangelogItemPropsI {
  defaultIsEdit?: boolean
  changelog: Changelog
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
          <Icon path={mdiSeal} size="small" />
        </Flex>
        <span>{props.changelog.state}</span>
        <span>{formatPlayedTime(props.changelog.playedTime)}</span>
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
            icon={<Icon path={mdiFormatVerticalAlignTop} />}
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
            icon={<Icon path={mdiFormatVerticalAlignBottom} />}
            disabled={props.isLast}
          />
        </Popconfirm>
        <Button
          type="text"
          icon={<Icon path={mdiPencilOutline} />}
          onClick={props.onEdit}
        />
        <Popconfirm
          title="Delete changelog"
          description="Are you sure to delete this changelog?"
          onConfirm={props.onDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<Icon path={mdiTrashCanOutline} />}
          />
        </Popconfirm>
      </Space.Compact>
    </Flex>
  )
}

export default ChangelogItem
