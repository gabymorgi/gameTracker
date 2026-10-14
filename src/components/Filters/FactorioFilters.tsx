import useFactorioFilters from '@/hooks/useFactorioFilters'
import { Checkbox, Form, Grid, Input, Select } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { useEffect } from 'react'
import { FilterActions, FilterBar, FilterField } from './FilterBar'
import { Icon } from '@/components/ui/Icon'
import { mdiMagnify, mdiPlaySpeed, mdiShapeOutline } from '@mdi/js'

export const FactorioFilters: React.FC = () => {
  const { queryParams, setQueryParams } = useFactorioFilters()
  const collapsed = !Grid.useBreakpoint().lg
  const [form] = Form.useForm<Store>()

  useEffect(() => {
    form.setFieldsValue(queryParams)
  }, [form, queryParams])

  const handleReset = () => {
    form.resetFields()
    setQueryParams({}, 'replace')
  }

  const handleSubmit = (values: Store) => {
    setQueryParams(
      {
        name: values.name || undefined,
        type: values.type || undefined,
        playedAt: values.playedAt === 'all' ? undefined : values.playedAt,
        hideModsWithDependencies: values.hideModsWithDependencies || undefined,
      },
      'replace',
    )
  }

  return (
    <FilterBar form={form} initialValues={queryParams} onSubmit={handleSubmit}>
      <FilterField
        name="name"
        label="Name"
        icon={<Icon path={mdiMagnify} />}
        collapsed={collapsed}
        width={180}
      >
        <Input allowClear />
      </FilterField>
      <FilterField
        name="type"
        label="Type"
        icon={<Icon path={mdiShapeOutline} />}
        collapsed={collapsed}
        width={140}
      >
        <Select
          allowClear
          options={[
            { value: 'PLANET', label: 'Planet' },
            { value: 'OVERHAUL', label: 'Overhaul' },
            { value: 'CONTENT', label: 'Content' },
            { value: 'MOD_PACK', label: 'Mod Pack' },
          ]}
        />
      </FilterField>
      <FilterField
        name="playedAt"
        label="Played"
        icon={<Icon path={mdiPlaySpeed} />}
        collapsed={collapsed}
        width={120}
      >
        <Select
          allowClear
          options={[
            { value: true, label: 'Played' },
            { value: false, label: 'Not played' },
          ]}
        />
      </FilterField>
      <Form.Item name="hideModsWithDependencies" valuePropName="checked">
        <Checkbox>Not in modpacks</Checkbox>
      </Form.Item>
      <FilterActions onReset={handleReset} />
    </FilterBar>
  )
}
