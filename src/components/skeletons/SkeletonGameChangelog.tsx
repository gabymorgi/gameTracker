import { Card, Flex, Listy, Skeleton } from 'antd'
import type { Ref } from 'react'

interface SkeletonGameChangelogProps {
  cant?: number
  ref?: Ref<HTMLDivElement>
}

function SkeletonGameChangelog(props: SkeletonGameChangelogProps) {
  const items = Array.from({ length: props.cant || 3 }).map((_, index) => ({
    key: index,
    content: (
      <Flex
        justify="space-between"
        align="center"
        gap="middle"
        className="w-full"
      >
        <Flex gap="middle">
          <Skeleton.Button style={{ width: 75 }} size="small" active />
          <Skeleton.Button style={{ width: 25 }} size="small" active />
          <Skeleton.Button style={{ width: 75 }} size="small" active />
          <Skeleton.Button style={{ width: 75 }} size="small" active />
        </Flex>
        <Skeleton.Button style={{ width: 125 }} size="small" active />
      </Flex>
    ),
  }))

  return (
    <Card
      ref={props.ref}
      size="small"
      title={
        <Flex gap="middle" align="center" style={{ padding: '8px 0' }}>
          <div style={{ flex: '2 1 0%' }}>
            <Skeleton.Image
              active
              styles={{
                root: { width: '100%' },
                content: { width: '100%', height: 130 },
              }}
            />
          </div>
          <Flex vertical gap="small" style={{ flex: '3 1 0%', minWidth: 0 }}>
            <Flex gap="small" align="center">
              <Skeleton.Button style={{ width: 70 }} size="small" active />
              <Skeleton.Avatar size="small" active />
              <Skeleton.Avatar size="small" active />
              <Skeleton.Button style={{ width: 55 }} size="small" active />
            </Flex>
            <Skeleton.Input style={{ width: '65%', height: 30 }} active />
            <Flex gap="small" align="center">
              <Skeleton.Button style={{ width: 40 }} size="small" active />
              <Skeleton.Button style={{ width: 150 }} size="small" active />
            </Flex>
            <Flex gap="small">
              <Skeleton.Button style={{ width: 80 }} size="small" active />
              <Skeleton.Button style={{ width: 95 }} size="small" active />
            </Flex>
          </Flex>
        </Flex>
      }
    >
      <Listy rowKey="key" items={items} itemRender={(item) => item.content} />
    </Card>
  )
}

export default SkeletonGameChangelog
