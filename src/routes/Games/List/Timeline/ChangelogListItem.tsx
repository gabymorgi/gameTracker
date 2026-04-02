import { useState } from 'react'
import ChangelogItem from './ChangelogItem'
import ChangelogItemInput from './ChangelogItemInput'
import { Changelog } from '@/ts/api/changelogs'

interface ChangelogListItemPropsI {
  defaultIsEdit?: boolean
  changelog: Changelog
  onFinish: (values: Changelog, id?: string) => void
  onDelete: () => void
}

const ChangelogListItem = (props: ChangelogListItemPropsI) => {
  const [isEdit, setIsEdit] = useState(props.defaultIsEdit || false)

  function handleFinish(values: Changelog) {
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
      onEdit={() => setIsEdit(!isEdit)}
      onDelete={props.onDelete}
    />
  )
}

export default ChangelogListItem
