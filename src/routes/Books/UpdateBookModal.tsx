import { InputBook } from '@/components/Form/InputBook'
import { getChangedValues } from '@/utils/getChangedValues'
import { Button, Form, InputNumber, Popover } from 'antd'
import Modal from '@/components/ui/Modal'
import { useEffect, useRef, useState } from 'react'
import { Book, BookWithChangelogs } from '@/ts/api/books'
import { UpdateParams } from '@/ts/api/common'
import { query } from '@/hooks/useFetch'
import DatePicker from '@/components/ui/DatePicker'
import { CalculatorOutlined } from '@ant-design/icons'
import { calculateBookChangelogsByMonthRange } from '@/utils/bookChangelogCalculator'
import { message } from '@/contexts/GlobalContext'

interface ChangelogCalculatorValues {
  range: [Date, Date]
  amount: number
}

interface Props {
  selectedBook?: Book
  onOk: (book: UpdateParams<Book>) => void
  onCancel: () => void
  loading?: boolean
}

const UpdateBookModal: React.FC<Props> = (props) => {
  const parsedValues = useRef<BookWithChangelogs>(undefined)
  const [form] = Form.useForm()
  const [calculatorForm] = Form.useForm<ChangelogCalculatorValues>()
  const [calculatorOpen, setCalculatorOpen] = useState(false)

  async function changeBook() {
    if (!props.selectedBook) return

    const changelogs = await query('changelogs/bookGet', {
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

  const handleCalculatorOpenChange = (open: boolean) => {
    setCalculatorOpen(open)
    if (!open) return

    const currentBook = form.getFieldValue('book') as
      | BookWithChangelogs
      | undefined
    if (!currentBook) return

    calculatorForm.setFieldsValue({
      range:
        currentBook.start && currentBook.end
          ? [currentBook.start, currentBook.end]
          : undefined,
      amount: currentBook.words,
    })
  }

  const handleAddCalculatedChangelogs = (values: ChangelogCalculatorValues) => {
    const currentBook = form.getFieldValue('book') as
      | BookWithChangelogs
      | undefined
    if (!currentBook) return

    const calculatedChangelogs = calculateBookChangelogsByMonthRange(
      values.range[0],
      values.range[1],
      values.amount,
      `book-${currentBook.id || 'new'}`,
    )

    form.setFieldsValue({
      book: {
        ...currentBook,
        changelogs: [
          ...(currentBook.changelogs || []),
          ...calculatedChangelogs,
        ],
      },
    })

    message.success('Calculated changelogs were added to the form')
    setCalculatorOpen(false)
  }

  const formId = `form-${props.selectedBook?.id}`

  return (
    <Modal
      title="Update Book"
      open={!!props.selectedBook}
      onCancel={props.onCancel}
      footer={[
        <Popover
          key="calculator"
          trigger="click"
          placement="topLeft"
          open={calculatorOpen}
          onOpenChange={handleCalculatorOpenChange}
          content={
            <Form
              form={calculatorForm}
              layout="vertical"
              onFinish={handleAddCalculatedChangelogs}
              style={{ width: 260 }}
            >
              <Form.Item
                label="Range"
                name="range"
                rules={[{ required: true, message: 'Please select the range' }]}
              >
                <DatePicker.RangePicker picker="month" className="w-full" />
              </Form.Item>
              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Please add an amount' }]}
              >
                <InputNumber min={1} className="w-full" />
              </Form.Item>
              <Button type="primary" htmlType="submit" block>
                Add to changelogs
              </Button>
            </Form>
          }
        >
          <Button icon={<CalculatorOutlined />} disabled={props.loading} />
        </Popover>,
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
