import { useState } from 'react'
import ChangelogItem from './ChangelogItem'
import ChangelogItemInput from './ChangelogItemInput'
import { ChangelogsGame } from '@/ts/api/changelogs'

interface ChangelogListItemPropsI {
  defaultIsEdit?: boolean
  changelog: ChangelogsGame['changelogs'][number]
  isFirst?: boolean
  isLast?: boolean
  onFinish: (values: ChangelogsGame['changelogs'][number], id?: string) => void
  onDelete: () => void
  onMergeUp: () => void
  onMergeDown: () => void
}

const ChangelogListItem = (props: ChangelogListItemPropsI) => {
  const [isEdit, setIsEdit] = useState(props.defaultIsEdit || false)

  function handleFinish(values: ChangelogsGame['changelogs'][number]) {
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
