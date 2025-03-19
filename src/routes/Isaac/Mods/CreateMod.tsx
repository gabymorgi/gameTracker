import { useState } from 'react'
import { Button, Flex, Form } from 'antd'
import Modal from '@/components/ui/Modal'
import { IsaacMod, IsaacModCreateInput } from '@/ts/api/isaac-mods'
import { defaultIsaacMod } from '@/utils/defaultValue'
import { InputIsaacMod } from '@/components/Form/InputIsaacMod'

interface CreateModProps {
  handleAddItem: (newItem: IsaacModCreateInput) => Promise<void>
  loading?: boolean
}

function CreateMod(props: CreateModProps) {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  const handleFinish = async ({ mod }: { mod: IsaacMod }) => {
    await props.handleAddItem({
      ...mod,
      playableContents: {
        create: mod.playableContents,
        update: [],
        delete: [],
      },
    })

    form.resetFields()
  }

  return (
    <Flex gap="small" vertical>
      <div>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Add Mod
        </Button>
      </div>
      <Modal
        title="Create Isaac Mod"
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
            form="create-game-form"
          >
            Create
          </Button>,
        ]}
      >
        <Form
          id="create-game-form"
          form={form}
          onFinish={handleFinish}
          initialValues={{ mod: defaultIsaacMod }}
          layout="vertical"
          className="p-middle"
        >
          <Form.Item name="mod" className="no-margin">
            <InputIsaacMod fieldName="mod" />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  )
}

export default CreateMod
