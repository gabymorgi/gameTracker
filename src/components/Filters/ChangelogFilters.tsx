import { Form, Grid, Input } from 'antd'
import { Store } from 'antd/lib/form/interface'
import DatePicker from '@/components/ui/DatePicker'
import useChangelogFilters from '@/hooks/useChangelogFilters'
import { FilterActions, FilterBar, FilterField } from './FilterBar'
import { Icon } from '@/components/ui/Icon'
import {
  mdiCalendarEndOutline,
  mdiCalendarStartOutline,
  mdiMagnify,
} from '@mdi/js'

export const ChangelogFilters: React.FC = () => {
  const { queryParams, setQueryParams } = useChangelogFilters()
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
        width={200}
      >
        <Input type="text" />
      </FilterField>
      <FilterField
        name="from"
        label="From"
        icon={<Icon path={mdiCalendarStartOutline} />}
        collapsed={collapsed}
        width={140}
      >
        <DatePicker />
      </FilterField>
      <FilterField
        name="to"
        label="To"
        icon={<Icon path={mdiCalendarEndOutline} />}
        collapsed={collapsed}
        width={140}
      >
        <DatePicker />
      </FilterField>
      <FilterActions onReset={handleReset} />
    </FilterBar>
  )
}
