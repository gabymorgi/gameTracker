import { useState } from 'react'
import { Button, Flex, Form } from 'antd'
import Modal from '@/components/ui/Modal'
import { defaultFactorioMod } from '@/utils/defaultValue'
import { InputFactorioMod } from '@/components/Form/InputFactorioMod'
import type {
  FactorioModCreateParams,
  FactorioModFormValues,
} from '@/ts/api/factorio-mods'

interface CreateModProps {
  handleAddItem: (newItem: FactorioModCreateParams) => Promise<void>
}

const CreateMod: React.FC<CreateModProps> = (props) => {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleFinish({ mod }: { mod: FactorioModFormValues }) {
    setLoading(true)
    try {
      await props.handleAddItem(mod)
      form.resetFields()
      setModalVisible(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex gap="small" vertical>
      <div>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Add Mod
        </Button>
      </div>
      <Modal
        title="Create Factorio Mod"
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
            form="create-factorio-mod-form"
          >
            Create
          </Button>,
        ]}
      >
        <Form
          id="create-factorio-mod-form"
          form={form}
          onFinish={handleFinish}
          initialValues={{ mod: defaultFactorioMod }}
          layout="vertical"
          className="p-middle"
        >
          <Form.Item name="mod" className="no-margin">
            <InputFactorioMod fieldName="mod" />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  )
}

export default CreateMod
