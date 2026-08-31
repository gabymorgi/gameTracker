import { Card, Flex, Listy, Skeleton } from 'antd'

interface SkeletonGameChangelogProps {
  cant?: number
}

function SkeletonGameChangelog(props: SkeletonGameChangelogProps) {
  const items = Array.from({ length: props.cant || 5 }).map((_, index) => ({
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
      size="small"
      title={
        <Flex gap="middle" justify="space-between" align="center">
          <Skeleton.Image style={{ width: 160, height: 75 }} active />
          <Skeleton.Button style={{ width: 150 }} size="large" active />
        </Flex>
      }
    >
      <Listy rowKey="key" items={items} itemRender={(item) => item.content} />
    </Card>
  )
}

export default SkeletonGameChangelog
