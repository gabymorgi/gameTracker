import { InputBook } from '@/components/Form/InputBook'
import { getChangedValues } from '@/utils/getChangedValues'
import { Button, Form } from 'antd'
import Modal from '@/components/ui/Modal'
import { useEffect, useRef } from 'react'
import { useMutation } from '@/hooks/useFetch'
import { Book } from '@prisma/client'

interface Props {
  selectedBook?: Book
  onOk: (book: Book) => void
  onCancel: () => void
}

const UpdateBookModal: React.FC<Props> = (props) => {
  const { mutate: updateBooks, loading } = useMutation('books/update')
  const parsedValues = useRef<Book | undefined>(props.selectedBook)
  const [form] = Form.useForm()

  async function changeBook() {
    if (!props.selectedBook) return
    parsedValues.current = props.selectedBook
    form.setFieldsValue({
      book: parsedValues.current,
    })
  }

  useEffect(() => {
    changeBook()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedBook])

  const handleFinish = async (values: { book: Book }) => {
    const changedValues: any = getChangedValues(
      parsedValues.current || {},
      values.book,
    )
    if (changedValues) {
      await updateBooks(changedValues)
    }
    props.onOk(values.book)
  }

  const formId = `form-${props.selectedBook?.id}`

  return (
    <Modal
      title="Update Book"
      open={!!props.selectedBook}
      onCancel={props.onCancel}
      footer={[
        <Button key="back" onClick={props.onCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button
          disabled={loading}
          loading={loading}
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
