import { Flex, List, Skeleton } from 'antd'

interface SkeletonGameChangelogProps {
  cant?: number
}

function SkeletonGameChangelog(props: SkeletonGameChangelogProps) {
  return (
    <List
      size="small"
      header={
        <Flex gap="middle" justify="space-between" align="center">
          <Skeleton.Image style={{ width: 160, height: 75 }} active />
          <Skeleton.Button style={{ width: 150 }} size="large" active />
        </Flex>
      }
      bordered
      dataSource={Array.from({ length: props.cant || 5 }).map((_, index) => (
        <Flex
          justify="space-between"
          align="center"
          gap="middle"
          key={index}
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
      ))}
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
  )
}

export default SkeletonGameChangelog
