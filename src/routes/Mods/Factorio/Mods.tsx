import { getCrudEndpoints, usePaginatedFetch } from '@/hooks/useFetch'
import { FactorioModWithDependencies } from '@/ts/api/factorio-mods'
import type {
  FactorioModGetParams,
  FactorioModUpdateParams,
} from '@/ts/api/factorio-mods'
import { Icon } from '@/components/ui/Icon'
import { mdiPencilOutline, mdiTrashCanOutline } from '@mdi/js'
import CreateMod from './CreateMod'
import UpdateMod from './UpdateMod'
import { modTypeLabels, requirementLabels } from './labels'
import MarkCircle from '@/routes/Mods/Isaac/MarkCircle'
import useFactorioFilters from '@/hooks/useFactorioFilters'
import { FactorioFilters } from '@/components/Filters/FactorioFilters'
import {
  Button,
  Empty,
  Flex,
  Popconfirm,
  Popover,
  Skeleton,
  Space,
  Table,
  TableColumnsType,
  Tag,
} from 'antd'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

const baseColumns: TableColumnsType<FactorioModWithDependencies> = [
  {
    title: 'Mod',
    dataIndex: 'name',
    key: 'name',
    render: (_name, mod) => {
      const type = modTypeLabels[mod.type]
      const requirements = requirementLabels[mod.requirements]
      return (
        <Flex vertical gap="small" align="flex-start">
          <a
            href={mod.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bold"
          >
            {mod.name}
          </a>
          {mod.playedAt ? (
            <span>{format(mod.playedAt, 'yyyy-MM-dd')}</span>
          ) : undefined}
          <Tag color={type.color} variant="solid">
            {type.label}
          </Tag>
          <Tag color={requirements.color} variant="outlined">
            {requirements.label}
          </Tag>
          {mod.dependencies.length > 0 && (
            <Popover
              trigger="click"
              content={
                <div>
                  {mod.dependencies.map((dependency) => (
                    <div key={dependency.id}>
                      <a href={`#factorio-${dependency.id}`}>
                        {dependency.name}
                      </a>
                    </div>
                  ))}
                </div>
              }
            >
              <Button type="link" size="small" style={{ padding: 0 }}>
                {mod.dependencies.length} dependencies
              </Button>
            </Popover>
          )}
        </Flex>
      )
    },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (description: string | null) =>
      description ? (
        <span style={{ whiteSpace: 'pre-wrap' }}>{description}</span>
      ) : (
        '-'
      ),
  },
  {
    title: 'Review',
    dataIndex: 'review',
    key: 'review',
    render: (review: string | null) =>
      review ? <span style={{ whiteSpace: 'pre-wrap' }}>{review}</span> : '-',
  },
  {
    title: 'Mark',
    dataIndex: 'mark',
    key: 'mark',
    render: (mark: number) => <MarkCircle mark={mark} />,
  },
]

const FactorioMods: React.FC = () => {
  const { queryParams } = useFactorioFilters()
  const {
    data,
    loading,
    nextPage,
    isMore,
    reset,
    addValue,
    updateValue,
    deleteValue,
  } = usePaginatedFetch({
    endpoints: getCrudEndpoints('factorio-mods'),
    pageSize: 12,
  })
  const [selectedMod, setSelectedMod] = useState<FactorioModWithDependencies>()
  const [isUpdating, setIsUpdating] = useState(false)

  const columns: TableColumnsType<FactorioModWithDependencies> = [
    ...baseColumns,
    {
      title: 'Actions',
      key: 'actions',
      render: (_value, mod) => (
        <Space.Compact>
          <Button
            type="text"
            aria-label="Edit mod"
            icon={<Icon path={mdiPencilOutline} />}
            onClick={() => setSelectedMod(mod)}
          />
          <Popconfirm
            title="Delete mod"
            description="Are you sure to delete this mod?"
            onConfirm={() => deleteValue(mod.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              aria-label="Delete mod"
              icon={<Icon path={mdiTrashCanOutline} />}
            />
          </Popconfirm>
        </Space.Compact>
      ),
    },
  ]

  async function updateItem(mod: FactorioModUpdateParams) {
    setIsUpdating(true)
    try {
      await updateValue(mod)
      setSelectedMod(undefined)
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    reset(queryParams as FactorioModGetParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

  return (
    <Flex gap="small" vertical>
      <Flex gap="large" justify="space-between" wrap>
        <CreateMod handleAddItem={addValue} />
        <FactorioFilters />
      </Flex>
      {loading && !data.length ? (
        <Skeleton active />
      ) : data.length ? (
        <>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            onRow={(mod) => ({ id: `factorio-${mod.id}` })}
          />
          <Button
            type="primary"
            onClick={() => nextPage()}
            disabled={!isMore}
            loading={loading}
          >
            Load more
          </Button>
        </>
      ) : (
        <Empty description="No Factorio mods found" />
      )}
      <UpdateMod
        loading={isUpdating}
        selectedMod={selectedMod}
        onCancel={() => setSelectedMod(undefined)}
        onOk={updateItem}
      />
    </Flex>
  )
}

export default FactorioMods
