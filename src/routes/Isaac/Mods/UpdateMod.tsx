import { getChangedValues } from '@/utils/getChangedValues'
import { Button, Form } from 'antd'
import Modal from '@/components/ui/Modal'
import { useEffect, useRef } from 'react'
import { UpdateParams } from '@/ts/api/common'
import { IsaacMod } from '@/ts/api/isaac-mods'
import { InputIsaacMod } from '@/components/Form/InputIsaacMod'

interface Props {
  loading?: boolean
  selectedMod?: IsaacMod
  onOk: (mod: UpdateParams<IsaacMod>) => void
  onCancel: () => void
}

const UpdateMod: React.FC<Props> = (props) => {
  const parsedValues = useRef<IsaacMod>()
  const [form] = Form.useForm()

  async function changeMod() {
    if (!props.selectedMod) return
    parsedValues.current = {
      ...props.selectedMod,
      playableContents: [...props.selectedMod.playableContents],
    }
    form.setFieldsValue({
      mod: props.selectedMod,
    })
  }

  useEffect(() => {
    changeMod()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedMod])

  const handleFinish = async (values: { mod: IsaacMod }) => {
    const changedValues = getChangedValues(
      parsedValues.current || {},
      values.mod,
    )
    props.onOk(changedValues)
  }

  const formId = `form-${props.selectedMod?.id}`

  return (
    <Modal
      title="Update Game"
      open={!!props.selectedMod}
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
        <Form.Item name="mod" className="no-margin">
          <InputIsaacMod fieldName="mod" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateMod
