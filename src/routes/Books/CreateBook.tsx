import { Button, Form } from 'antd'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { BookI } from '@/ts/books'
import { InputBook } from '@/components/Form/InputBook'
import { query } from '@/hooks/useFetch'

interface CreateBookProps {
  handleAddItem: (book: BookI) => void
}

export const CreateBook: React.FC<CreateBookProps> = (props) => {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFinish = async ({ book }: { book: BookI }) => {
    setLoading(true)
    const createdBook = await query('books/create', book)
    form.resetFields()
    setLoading(false)
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
