import { useState } from 'react'
import { ChangelogI } from '@/ts/game'
import ChangelogItem from './ChangelogItem'
import ChangelogItemInput from './ChangelogItemInput'

interface ChangelogListItemPropsI {
  defaultIsEdit?: boolean
  changelog: ChangelogI
  onFinish: (values: ChangelogI, id?: string) => void
  onDelete: () => void
}

const ChangelogListItem = (props: ChangelogListItemPropsI) => {
  const [isEdit, setIsEdit] = useState(props.defaultIsEdit || false)

  function handleFinish(values: ChangelogI) {
    console.log(values)
    // props.onFinish(values)
    // setIsEdit(!isEdit)
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
