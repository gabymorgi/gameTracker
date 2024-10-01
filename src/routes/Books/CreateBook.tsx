import { Button, Form } from 'antd'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { InputBook } from '@/components/Form/InputBook'
import { BookCreateInput } from '@/ts/api/books'

interface CreateBookProps {
  handleAddItem: (book: BookCreateInput) => void
  loading?: boolean
}

export const CreateBook: React.FC<CreateBookProps> = (props) => {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  const handleFinish = async ({ book }: { book: BookCreateInput }) => {
    props.handleAddItem(book)
    form.resetFields()
    setModalVisible(false)
  }
  return (
    <>
      <Button
        type="primary"
        loading={props.loading}
        disabled={props.loading}
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
            disabled={props.loading}
          >
            Cancel
          </Button>,
          <Button
            type="primary"
            disabled={props.loading}
            loading={props.loading}
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
