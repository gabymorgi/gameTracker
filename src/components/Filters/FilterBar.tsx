import {
  mdiFilterCheckOutline,
  mdiFilterRemoveOutline,
  mdiSortAlphabeticalAscendingVariant,
  mdiSortAlphabeticalDescendingVariant,
} from '@mdi/js'
import { Icon } from '@/components/ui/Icon'
import { Badge, Button, Form, Grid, Popover, Space, Tooltip } from 'antd'
import { FormInstance } from 'antd/lib/form'
import { Store } from 'antd/lib/form/interface'
import {
  cloneElement,
  CSSProperties,
  ReactElement,
  ReactNode,
  PropsWithChildren,
} from 'react'
import styled from 'styled-components'

const Bar = styled.div`
  .ant-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .ant-form-item {
    margin: 0;
  }

  .filter-actions {
    margin-left: 8px;
  }
`

interface FilterBarProps {
  form: FormInstance<Store>
  initialValues: Store
  onSubmit: (values: Store) => void
}

export const FilterBar = ({
  form,
  initialValues,
  onSubmit,
  children,
}: PropsWithChildren<FilterBarProps>) => (
  <Bar>
    <Form
      form={form}
      layout="inline"
      initialValues={initialValues}
      // Fields inside closed popovers are unmounted, so read the whole store.
      onFinish={() => onSubmit(form.getFieldsValue(true))}
    >
      {children}
    </Form>
  </Bar>
)

interface FilterActionsProps {
  onReset: () => void
}

export const FilterActions = ({ onReset }: FilterActionsProps) => {
  const size = Grid.useBreakpoint().lg ? 'medium' : 'large'
  return (
    <Space size={8} className="filter-actions">
      <Tooltip title="Reset">
        <Button
          icon={<Icon path={mdiFilterRemoveOutline} />}
          aria-label="Reset"
          color="danger"
          onClick={onReset}
          variant="filled"
          size={size}
        />
      </Tooltip>
      <Tooltip title="Apply">
        <Button
          icon={<Icon path={mdiFilterCheckOutline} />}
          aria-label="Apply"
          type="primary"
          htmlType="submit"
          size={size}
        />
      </Tooltip>
    </Space>
  )
}

interface SortDirectionToggleProps {
  value?: string
  onChange?: (value: string) => void
}

const SortDirectionToggle = ({ value, onChange }: SortDirectionToggleProps) => {
  const isAsc = value === 'asc'
  const size = Grid.useBreakpoint().lg ? 'medium' : 'large'
  return (
    <Tooltip title={isAsc ? 'Ascending' : 'Descending'}>
      <Button
        aria-label={isAsc ? 'Ascending' : 'Descending'}
        size={size}
        icon={
          isAsc ? (
            <Icon path={mdiSortAlphabeticalAscendingVariant} />
          ) : (
            <Icon path={mdiSortAlphabeticalDescendingVariant} />
          )
        }
        onClick={() => onChange?.(isAsc ? 'desc' : 'asc')}
      />
    </Tooltip>
  )
}

export const SortDirectionField = () => (
  <Form.Item name="sortDirection" noStyle>
    <SortDirectionToggle />
  </Form.Item>
)

interface FilterFieldProps {
  name: string
  label: string
  icon: ReactNode
  collapsed: boolean
  // Omit for controls that take no placeholder/width, like checkbox groups.
  width?: number
  children: ReactElement<{ placeholder?: string; style?: CSSProperties }>
}

function hasValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0
  return value !== undefined && value !== null && value !== ''
}

export const FilterField = ({
  name,
  label,
  icon,
  collapsed,
  width,
  children,
}: FilterFieldProps) => {
  const value: unknown = Form.useWatch(name)
  const control = (
    <Form.Item name={name} noStyle>
      {width === undefined
        ? children
        : cloneElement(children, {
            placeholder: label,
            style: { width: collapsed ? 220 : width },
          })}
    </Form.Item>
  )

  if (!collapsed) return control

  return (
    <Popover trigger="click" title={label} content={control}>
      <Badge dot={hasValue(value)}>
        <Button icon={icon} aria-label={label} size="large" />
      </Badge>
    </Popover>
  )
}
