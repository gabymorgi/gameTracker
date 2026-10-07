import { Form, Grid, Input, Select } from 'antd'
import { Store } from 'antd/lib/form/interface'
import DatePicker from '@/components/ui/DatePicker'
import useBookFilters from '@/hooks/useBookFilters'
import { $Enums } from '#prisma-browser-client'
import {
  FilterActions,
  FilterBar,
  FilterField,
  SortDirectionField,
} from './FilterBar'
import { Icon } from '@/components/ui/Icon'
import {
  mdiBookOpenBlankVariantOutline,
  mdiCalendarEndOutline,
  mdiCalendarStartOutline,
  mdiMagnify,
  mdiSort,
  mdiTranslate,
} from '@mdi/js'

export const BookFilters: React.FC = () => {
  const { queryParams, setQueryParams } = useBookFilters()
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
        width={170}
      >
        <Input type="text" />
      </FilterField>
      <FilterField
        name="start"
        label="Start"
        icon={<Icon path={mdiCalendarStartOutline} />}
        collapsed={collapsed}
        width={125}
      >
        <DatePicker />
      </FilterField>
      <FilterField
        name="end"
        label="End"
        icon={<Icon path={mdiCalendarEndOutline} />}
        collapsed={collapsed}
        width={125}
      >
        <DatePicker />
      </FilterField>
      <FilterField
        name="state"
        label="State"
        icon={<Icon path={mdiBookOpenBlankVariantOutline} />}
        collapsed={collapsed}
        width={130}
      >
        <Select
          allowClear
          options={Object.keys($Enums.BookState).map((key) => ({
            value: key,
            label: key.replace('_', ' ').toLocaleLowerCase(),
          }))}
        />
      </FilterField>
      <FilterField
        name="language"
        label="Language"
        icon={<Icon path={mdiTranslate} />}
        collapsed={collapsed}
        width={110}
      >
        <Select
          allowClear
          options={[
            { value: 'English', label: 'English' },
            { value: 'Spanish', label: 'Spanish' },
          ]}
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
          options={[
            { value: 'name', label: 'Name' },
            { value: 'start', label: 'Start' },
            { value: 'end', label: 'End' },
            { value: 'words', label: 'Words' },
          ]}
        />
      </FilterField>
      <SortDirectionField />
      <FilterActions onReset={handleReset} />
    </FilterBar>
  )
}
