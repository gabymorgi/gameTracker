import { Memo } from '@/ts/books'
import { useState } from 'react'
import EditingCard from './EditingCard'
import FullCard from './FullCard'

interface MemoCardProps {
  memo: Memo
  handleDelete: (id: string) => void
  handleEdit: (memo: Memo) => void
}

function MemoCard(props: MemoCardProps) {
  const [isEditing, setIsEditing] = useState(!props.memo.definition)

  return (
    <div key={props.memo.id}>
      {isEditing ? (
        <EditingCard
          memo={props.memo}
          handleClose={() => setIsEditing(false)}
          handleEdit={props.handleEdit}
        />
      ) : (
        <FullCard
          handleDelete={props.handleDelete}
          memo={props.memo}
          handleEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  )
}

export default MemoCard
