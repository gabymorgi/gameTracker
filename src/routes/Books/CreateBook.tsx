import { Button, Form } from 'antd'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { InputBook } from '@/components/Form/InputBook'
import { useMutation } from '@/hooks/useFetch'
import { Book } from '@prisma/client'

interface CreateBookProps {
  handleAddItem: (book: Book) => void
}

export const CreateBook: React.FC<CreateBookProps> = (props) => {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const { mutate: createBook, loading } = useMutation('books/create')

  const handleFinish = async ({ book }: { book: Book }) => {
    await createBook(book)
    form.resetFields()
    props.handleAddItem({
      ...book,
      id: createdBook.id,
    })
  }
  return (
    <>
      <Button
        type="primary"
        loading={loading}
        disabled={loading}
        onClick={() => setModalVisible(true)}
      >
        New Book
      </Button>
      <Modal
        title="Create Book"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="back"
            onClick={() => setModalVisible(false)}
            disabled={loading}
          >
            Cancel
          </Button>,
          <Button
            type="primary"
            disabled={loading}
            loading={loading}
            key="submit"
            htmlType="submit"
            form="create-book-form"
          >
            Create
          </Button>,
        ]}
      >
        <Form
          id="create-book-form"
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          className="p-middle"
        >
          <Form.Item name="book" className="no-margin">
            <InputBook fieldName="book" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
