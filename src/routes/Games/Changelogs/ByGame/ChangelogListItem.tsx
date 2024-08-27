import { useState } from 'react'
import { ChangelogsGameI } from '@/ts/game'
import ChangelogItem from './ChangelogItem'
import ChangelogItemInput from './ChangelogItemInput'

interface ChangelogListItemPropsI {
  defaultIsEdit?: boolean
  changelog: ChangelogsGameI['changeLogs'][number]
  isFirst?: boolean
  isLast?: boolean
  onFinish: (values: ChangelogsGameI['changeLogs'][number], id?: string) => void
  onDelete: () => void
  onMergeUp: () => void
  onMergeDown: () => void
}

const ChangelogListItem = (props: ChangelogListItemPropsI) => {
  const [isEdit, setIsEdit] = useState(props.defaultIsEdit || false)

  function handleFinish(values: ChangelogsGameI['changeLogs'][number]) {
    props.onFinish(values)
    setIsEdit(!isEdit)
  }

  return isEdit ? (
    <ChangelogItemInput
      changelog={props.changelog}
      onFinish={handleFinish}
      onCancel={() => setIsEdit(!isEdit)}
    />
  ) : (
    <ChangelogItem
      changelog={props.changelog}
      isFirst={props.isFirst}
      isLast={props.isLast}
      onEdit={() => setIsEdit(!isEdit)}
      onDelete={props.onDelete}
      onMergeUp={props.onMergeUp}
      onMergeDown={props.onMergeDown}
    />
  )
}

export default ChangelogListItem
