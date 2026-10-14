import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  InputProps,
  Row,
  Select,
} from 'antd'
import DatePicker from '@/components/ui/DatePicker'
import { NamePath } from 'antd/es/form/interface'
import { formattedPathName } from '@/utils/format'
import { query } from '@/hooks/useFetch'
import { modTypeLabels, requirementLabels } from '@/routes/Mods/Factorio/labels'
import type {
  FactorioModFormValues,
  FactorioModSearch,
} from '@/ts/api/factorio-mods'

interface InputFactorioModProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: FactorioModFormValues
  onChange?: (value: FactorioModFormValues) => void
  fieldName?: NamePath
  /** Mods already selected as dependencies, so their names show before any search. */
  knownDependencies?: FactorioModSearch[]
}

const SEARCH_DELAY_MS = 300

function toOptions(mods: FactorioModSearch[]) {
  return mods.map((mod) => ({ value: mod.id, label: mod.name }))
}

export const InputFactorioMod: React.FC<InputFactorioModProps> = (props) => {
  const fieldNames = formattedPathName(props.fieldName)
  const [found, setFound] = useState<FactorioModSearch[]>([])
  const [searching, setSearching] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  const options = useMemo(() => {
    const byId = new Map<string, FactorioModSearch>()
    props.knownDependencies?.forEach((mod) => byId.set(mod.id, mod))
    found.forEach((mod) => byId.set(mod.id, mod))
    return toOptions([...byId.values()])
  }, [found, props.knownDependencies])

  function handleSearch(search: string) {
    clearTimeout(timeout.current)
    if (!search) return
    timeout.current = setTimeout(async () => {
      setSearching(true)
      try {
        setFound(await query('factorio-mods/search', { search }))
      } finally {
        setSearching(false)
      }
    }, SEARCH_DELAY_MS)
  }

  return (
    <Card size="small">
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name={[...fieldNames, 'name']}
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name={[...fieldNames, 'link']}
            label="Link"
            rules={[{ required: true }, { type: 'url' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8}>
          <Form.Item name={[...fieldNames, 'type']} label="Type">
            <Select
              options={Object.entries(modTypeLabels).map(
                ([value, { label }]) => ({ value, label }),
              )}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8}>
          <Form.Item
            name={[...fieldNames, 'requirements']}
            label="Requirements"
          >
            <Select
              options={Object.entries(requirementLabels).map(
                ([value, { label }]) => ({ value, label }),
              )}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={4}>
          <Form.Item name={[...fieldNames, 'mark']} label="Mark">
            <InputNumber min={-1} max={10} className="w-full" />
          </Form.Item>
        </Col>
        <Col xs={12} sm={4}>
          <Form.Item name={[...fieldNames, 'playedAt']} label="Played At">
            <DatePicker />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name={[...fieldNames, 'description']} label="Description">
            <Input.TextArea autoSize={{ minRows: 3 }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name={[...fieldNames, 'review']} label="Review">
            <Input.TextArea autoSize={{ minRows: 3 }} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name={[...fieldNames, 'dependencyIds']}
            label="Dependencies"
          >
            <Select
              mode="multiple"
              showSearch={{ filterOption: false, onSearch: handleSearch }}
              options={options}
              loading={searching}
              placeholder="Search mods"
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  )
}
