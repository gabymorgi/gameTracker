import useIsaacFilters from '@/hooks/useIsaacFilters'
import { Checkbox, Form, Grid, InputNumber, Select } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { useState } from 'react'
import {
  FilterActions,
  FilterBar,
  FilterField,
  SortDirectionField,
} from './FilterBar'
import { Icon } from '@/components/ui/Icon'
import {
  mdiFilterOutline,
  mdiIdentifier,
  mdiPlaySpeed,
  mdiShapeOutline,
} from '@mdi/js'

const options = [
  { label: 'Items', value: 'items' },
  { label: 'Enemies', value: 'enemies' },
  { label: 'QoL', value: 'qol' },
]

export const ModFilters: React.FC = () => {
  const { queryParams, setQueryParams } = useIsaacFilters()
  const [isAppId, setIsAppId] = useState(!!queryParams.appId)
  const collapsed = !Grid.useBreakpoint().lg
  const [form] = Form.useForm<Store>()
  const handleReset = () => {
    form.resetFields()
    setQueryParams({}, 'replace')
  }
  const handleSubmit = (values: Store) => {
    if (values.appId) {
      setQueryParams(
        {
          appId: values.appId,
          sortDirection: values.sortDirection,
        },
        'replace',
      )
    } else {
      setQueryParams(values, 'replace')
    }
  }

  return (
    <FilterBar form={form} initialValues={queryParams} onSubmit={handleSubmit}>
      <FilterField
        name="contentType"
        label="Type"
        icon={<Icon path={mdiShapeOutline} />}
        collapsed={collapsed}
        width={120}
      >
        <Select
          disabled={isAppId}
          allowClear
          options={[
            { value: 'CHARACTER', label: 'Character' },
            { value: 'CHALLENGE', label: 'Challenge' },
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
          disabled={isAppId}
          allowClear
          options={[
            { value: true, label: 'Played' },
            { value: false, label: 'Not played' },
          ]}
        />
      </FilterField>
      <FilterField
        name="filter"
        label="Filter"
        icon={<Icon path={mdiFilterOutline} />}
        collapsed={collapsed}
      >
        <Checkbox.Group disabled={isAppId} options={options} />
      </FilterField>
      <FilterField
        name="appId"
        label="App Id"
        icon={<Icon path={mdiIdentifier} />}
        collapsed={collapsed}
        width={120}
      >
        <InputNumber
          min={0}
          onChange={(value) => {
            setIsAppId(!!value)
          }}
          controls={false}
        />
      </FilterField>
      <SortDirectionField />
      <FilterActions onReset={handleReset} />
    </FilterBar>
  )
}
