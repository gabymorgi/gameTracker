import React, { useEffect, useState } from 'react'
import { Button, Flex, Popconfirm, Space, Table, TableColumnsType } from 'antd'
import Link from 'antd/es/typography/Link'
import { usePaginatedFetch } from '@/hooks/useFetch'
import { format } from 'date-fns'
import { IsaacMod } from '@/ts/api/isaac-mods'
import { ModFilters } from '@/components/Filters/IsaacFilters'
import { InView } from 'react-intersection-observer'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import CreateMod from './CreateMod'
import useIsaacFilters from '@/hooks/useIsaacFilters'
import UpdateMod from './UpdateMod'
import { UpdateParams } from '@/ts/api/common'
import MarkCircle from './MarkCircle'

interface ExpandedDataType {
  key: React.Key
  name: string
  description: string
  review: string
  mark: React.ReactNode
  type: React.ReactNode
}

interface DataType {
  key: React.Key
  name: React.ReactNode
  playedAt: string
  items: number
  isQoL: string
  enemies: string
  extra: string
  playableContents: IsaacMod['playableContents']
  actions: React.ReactNode
}

function IsaacMods() {
  const { queryParams } = useIsaacFilters()
  const {
    data,
    loading,
    nextPage,
    isMore,
    reset,
    addValue,
    deleteValue,
    updateValue,
  } = usePaginatedFetch('isaac-mods')
  const [selectedMod, setSelectedMod] = useState<IsaacMod>()

  useEffect(() => {
    reset(queryParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

  function updateItem(mod: UpdateParams<IsaacMod>) {
    updateValue(mod)
    setSelectedMod(undefined)
  }

  const columns: TableColumnsType<DataType> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Wiki', dataIndex: 'wiki', key: 'wiki' },
    { title: 'Played At', dataIndex: 'playedAt', key: 'playedAt' },
    { title: 'Items', dataIndex: 'items', key: 'items' },
    { title: 'Is QoL', dataIndex: 'isQoL', key: 'isQoL' },
    { title: 'Enemies', dataIndex: 'enemies', key: 'enemies' },
    { title: 'Extra', dataIndex: 'extra', key: 'extra' },
    { title: 'Actions', dataIndex: 'actions', key: 'actions' },
  ]

  const dataSource = data.map<DataType>((mod) => ({
    key: mod.id,
    name: (
      <Link
        target="_blank"
        href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.appid}`}
      >
        {mod.name}
      </Link>
    ),
    wiki: mod.wiki ? (
      <Link href={mod.wiki} target="_blank">
        Wiki
      </Link>
    ) : (
      '-'
    ),
    playedAt: mod.playedAt ? format(mod.playedAt, 'yyyy-MM-dd') : '-',
    items: mod.items,
    isQoL: mod.isQoL ? 'Yes' : 'No',
    enemies: mod.isEnemies ? 'Yes' : 'No',
    extra: mod.extra || '-',
    playableContents: mod.playableContents,
    actions: (
      <Space.Compact>
        <Button
          type="text"
          icon={<EditFilled />}
          onClick={() => setSelectedMod(mod)}
        />
        <Popconfirm
          title="Delete changelog"
          description="Are you sure to delete this changelog?"
          onConfirm={() => deleteValue(mod.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteFilled />} />
        </Popconfirm>
      </Space.Compact>
    ),
  }))
  if (isMore && !loading) {
    dataSource.push({
      key: 'loading',
      name: (
        <InView as="div" onChange={(inView) => inView && nextPage()}>
          Loading
        </InView>
      ),
      playedAt: '-',
      items: 0,
      isQoL: '-',
      enemies: '-',
      extra: '-',
      playableContents: [],
      actions: '-',
    })
  }

  const expandColumns: TableColumnsType<ExpandedDataType> = [
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Review', dataIndex: 'review', key: 'review' },
    { title: 'Mark', dataIndex: 'mark', key: 'mark' },
  ]

  function expandedRowRender(mod: DataType) {
    const expandDataSource: ExpandedDataType[] = mod.playableContents.map(
      (content) => ({
        key: content.id,
        name: content.name,
        description: content.description || '-',
        review: content.review || '-',
        mark: <MarkCircle mark={content.mark} />,
        type:
          content.type === 'CHARACTER' ? (
            <img src="/isaac-character.webp" alt="Character" />
          ) : (
            <img src="/isaac-challenge.webp" alt="Challenge" />
          ),
      }),
    )
    return (
      <Table<ExpandedDataType>
        columns={expandColumns}
        dataSource={expandDataSource}
        pagination={false}
      />
    )
  }

  return (
    <Flex gap="small" vertical>
      <ModFilters />
      <CreateMod handleAddItem={addValue} loading={loading} />
      <Table<DataType>
        columns={columns}
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
        dataSource={dataSource}
        pagination={false}
      />
      <UpdateMod
        loading={loading}
        selectedMod={selectedMod}
        onCancel={() => setSelectedMod(undefined)}
        onOk={updateItem}
      />
    </Flex>
  )
}

export default IsaacMods
