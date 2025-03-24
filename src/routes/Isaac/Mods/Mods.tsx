import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Flex,
  Popconfirm,
  Space,
  Spin,
  Table,
  TableColumnsType,
} from 'antd'
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
import styled from 'styled-components'

const StyledTable = styled(Table)`
  .ant-table-cell {
    white-space: pre-wrap;
  }
` as typeof Table

interface DataType {
  key: React.Key
  rowSpan: number
  contentName: React.ReactNode
  description: string
  review: string
  mark: React.ReactNode
  modData?: React.ReactNode
  actions?: React.ReactNode
}

function handleCell({ rowSpan }: { rowSpan: number }) {
  return { rowSpan: rowSpan || 0 }
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Mod Data',
    dataIndex: 'modData',
    key: 'modData',
    onCell: handleCell,
  },
  { title: 'Content Name', dataIndex: 'contentName', key: 'contentName' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
  { title: 'Review', dataIndex: 'review', key: 'review' },
  { title: 'Mark', dataIndex: 'mark', key: 'mark' },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    onCell: handleCell,
  },
]

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
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    reset(queryParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

  async function updateItem(mod: UpdateParams<IsaacMod>) {
    setIsUpdating(true)
    await updateValue(mod)
    setSelectedMod(undefined)
    setIsUpdating(false)
  }

  const dataSource: Array<DataType> = useMemo(() => {
    const dataSource: Array<DataType> = []
    data.forEach((mod) => {
      const modData: DataType[] = mod.playableContents.map((content) => ({
        key: content.id,
        rowSpan: 0,
        contentName: (
          <div>
            {content.type === 'CHARACTER' ? (
              <img src="/isaac-character.webp" alt="Character" />
            ) : (
              <img src="/isaac-challenge.webp" alt="Challenge" />
            )}{' '}
            {content.name}
          </div>
        ),
        description: content.description || '-',
        review: content.review || '-',
        mark: <MarkCircle mark={content.mark} />,
      }))
      modData[0].rowSpan = mod.playableContents.length || 1
      modData[0].modData = (
        <Flex gap="small" vertical>
          <Link
            target="_blank"
            href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.appid}`}
          >
            {mod.name}
          </Link>
          {mod.wiki ? (
            <Link href={mod.wiki} target="_blank">
              Wiki
            </Link>
          ) : null}
          <span>
            {mod.playedAt ? format(mod.playedAt, 'yyyy-MM-dd') : 'not played'}
          </span>
          <div className="flex items-center">
            {mod.items ? (
              <>
                {mod.items} <img src="/isaac-items.webp" alt="Character" />
              </>
            ) : null}
            {mod.isQoL ? <img src="/isaac-qol.webp" alt="QoL" /> : null}
            {mod.isEnemies ? (
              <img src="/isaac-enemies.webp" alt="Enemies" />
            ) : null}
          </div>
          {mod.extra ? <span>{mod.extra}</span> : null}
        </Flex>
      )
      modData[0].actions = (
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
      )
      dataSource.push(...modData)
    })
    if (isMore && !loading) {
      dataSource.push({
        key: 'loading',
        modData: (
          <InView as="div" onChange={(inView) => inView && nextPage()}>
            Loading
          </InView>
        ),
        rowSpan: 1,
        contentName: '',
        description: '',
        review: '',
        mark: '',
      })
    }
    return dataSource
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isMore, loading])

  return (
    <Flex gap="small" vertical>
      <Spin spinning={loading} fullscreen />
      <ModFilters />
      <CreateMod handleAddItem={addValue} loading={isUpdating} />
      <StyledTable
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
      <UpdateMod
        loading={isUpdating}
        selectedMod={selectedMod}
        onCancel={() => setSelectedMod(undefined)}
        onOk={updateItem}
      />
    </Flex>
  )
}

export default IsaacMods
