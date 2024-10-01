import { InputBook } from '@/components/Form/InputBook'
import { getChangedValues } from '@/utils/getChangedValues'
import { Button, Form } from 'antd'
import Modal from '@/components/ui/Modal'
import { useEffect, useRef } from 'react'
import { Book, BookWithChangelogs } from '@/ts/api/books'
import { UpdateParams } from '@/ts/api/common'
import { query } from '@/hooks/useFetch'

interface Props {
  selectedBook?: Book
  onOk: (book: UpdateParams<Book>) => void
  onCancel: () => void
  loading?: boolean
}

const UpdateBookModal: React.FC<Props> = (props) => {
  const parsedValues = useRef<BookWithChangelogs | undefined>()
  const [form] = Form.useForm()

  async function changeBook() {
    if (!props.selectedBook) return

    const changelogs = await query('changelogs/bookGet', 'POST', {
      bookId: props.selectedBook.id,
    })
    changelogs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    parsedValues.current = {
      ...props.selectedBook,
      changelogs: changelogs,
    }
    form.setFieldsValue({
      book: parsedValues.current,
    })
  }

  useEffect(() => {
    changeBook()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedBook])

  const handleFinish = async (values: { book: Book }) => {
    if (!props.selectedBook) return
    const changedValues = getChangedValues<Book>(
      parsedValues.current || {},
      values.book,
    )
    if (changedValues) {
      props.onOk(changedValues)
    }
  }

  const formId = `form-${props.selectedBook?.id}`

  return (
    <Modal
      title="Update Book"
      open={!!props.selectedBook}
      onCancel={props.onCancel}
      footer={[
        <Button key="back" onClick={props.onCancel} disabled={props.loading}>
          Cancel
        </Button>,
        <Button
          disabled={props.loading}
          loading={props.loading}
          key="submit"
          htmlType="submit"
          form={formId}
        >
          Update
        </Button>,
      ]}
    >
      <Form
        form={form}
        key={formId}
        id={formId}
        onFinish={handleFinish}
        layout="vertical"
      >
        <Form.Item name="book" className="no-margin">
          <InputBook fieldName="book" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateBookModal
