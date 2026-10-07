import { Icon } from '@/components/ui/Icon'
import { Form, Grid, Input, Select } from 'antd'
import { Store } from 'antd/lib/form/interface'
import DatePicker from '@/components/ui/DatePicker'
import useGameFilters from '@/hooks/useGameFilters'
import { InputState } from '@/components/Form/InputState'
import { GlobalContext } from '@/contexts/GlobalContext'
import { useContext } from 'react'
import {
  FilterActions,
  FilterBar,
  FilterField,
  SortDirectionField,
} from './FilterBar'
import {
  mdiCalendarEndOutline,
  mdiCalendarStartOutline,
  mdiGamepadVariantOutline,
  mdiMagnify,
  mdiSort,
  mdiTagOutline,
} from '@mdi/js'

export const GameFilters: React.FC = () => {
  const { queryParams, setQueryParams } = useGameFilters()
  const { tags } = useContext(GlobalContext)
  const collapsed = !Grid.useBreakpoint().lg
  const [form] = Form.useForm<Store>()
  const handleReset = () => {
    form.resetFields()
    setQueryParams({}, 'replace')
  }
  const handleSubmit = (values: Store) => {
    setQueryParams(values, 'replace')
  }

  return (
    <FilterBar form={form} initialValues={queryParams} onSubmit={handleSubmit}>
      <FilterField
        name="name"
        label="Name"
        icon={<Icon path={mdiMagnify} />}
        collapsed={collapsed}
        width={125}
      >
        <Input type="text" />
      </FilterField>
      <FilterField
        name="start"
        label="Start"
        icon={<Icon path={mdiCalendarStartOutline} />}
        collapsed={collapsed}
        width={115}
      >
        <DatePicker />
      </FilterField>
      <FilterField
        name="end"
        label="End"
        icon={<Icon path={mdiCalendarEndOutline} />}
        collapsed={collapsed}
        width={115}
      >
        <DatePicker />
      </FilterField>
      <FilterField
        name="state"
        label="State"
        icon={<Icon path={mdiGamepadVariantOutline} />}
        collapsed={collapsed}
        width={130}
      >
        <InputState allowClear />
      </FilterField>
      <FilterField
        name="tags"
        label="Tags"
        icon={<Icon path={mdiTagOutline} />}
        collapsed={collapsed}
        width={210}
      >
        <Select
          mode="tags"
          allowClear
          maxTagCount="responsive"
          options={tags ? Object.keys(tags).map((key) => ({ value: key })) : []}
        />
      </FilterField>
      <FilterField
        name="sortBy"
        label="Sort by"
        icon={<Icon path={mdiSort} />}
        collapsed={collapsed}
        width={90}
      >
        <Select
          allowClear
          options={['name', 'start', 'end', 'hours', 'mark'].map((value) => ({
            value,
          }))}
        />
      </FilterField>
      <SortDirectionField />
      <FilterActions onReset={handleReset} />
    </FilterBar>
  )
}
