import { useEffect, useMemo, useRef } from 'react'
import { Button, Form } from 'antd'
import Modal from '@/components/ui/Modal'
import { getChangedValues } from '@/utils/getChangedValues'
import { InputFactorioMod } from '@/components/Form/InputFactorioMod'
import type {
  FactorioModFormValues,
  FactorioModUpdateParams,
  FactorioModWithDependencies,
} from '@/ts/api/factorio-mods'

interface Props {
  loading?: boolean
  selectedMod?: FactorioModWithDependencies
  onOk: (mod: FactorioModUpdateParams) => void
  onCancel: () => void
}

function toFormValues(mod: FactorioModWithDependencies) {
  const { dependencies, ...rest } = mod
  return { ...rest, dependencyIds: dependencies.map(({ id }) => id) }
}

const UpdateMod: React.FC<Props> = (props) => {
  const original = useRef<ReturnType<typeof toFormValues>>(undefined)
  const [form] = Form.useForm()

  useEffect(() => {
    if (!props.selectedMod) return
    original.current = toFormValues(props.selectedMod)
    form.setFieldsValue({ mod: original.current })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedMod])

  const knownDependencies = useMemo(
    () => props.selectedMod?.dependencies ?? [],
    [props.selectedMod],
  )

  function handleFinish({ mod }: { mod: FactorioModFormValues }) {
    if (!original.current) return
    const changes = getChangedValues<FactorioModUpdateParams>(
      original.current,
      { ...mod, id: original.current.id },
    )
    if (!changes) return props.onCancel()
    props.onOk(changes as FactorioModUpdateParams)
  }

  const formId = `form-${props.selectedMod?.id}`

  return (
    <Modal
      title="Update Mod"
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
          <InputFactorioMod
            fieldName="mod"
            knownDependencies={knownDependencies}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateMod
