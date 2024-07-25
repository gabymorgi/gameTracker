import { Card, Divider, Flex, Skeleton } from 'antd'

function SkeletonBook() {
  return (
    <Card size="small">
      <Flex gap="middle" className="h-full">
        <Skeleton.Image style={{ width: 120, height: 180 }} active />
        <Flex vertical gap="middle" align="stretch" className="w-full h-full">
          <Skeleton.Button
            size="small"
            className="text-center"
            style={{ width: 100 }}
            active
          />
          <Flex
            justify="space-between"
            align="center"
            className="text-center w-full"
          >
            <Skeleton.Button style={{ width: 50 }} size="small" active />
            <Divider type="vertical" />
            <Skeleton.Button style={{ width: 50 }} size="small" active />
          </Flex>
          <Skeleton.Button block shape="round" active />
          <Flex
            justify="space-between"
            align="center"
            className="text-center w-full"
          >
            <Skeleton.Button style={{ width: 50 }} size="small" active />
            <Skeleton.Button style={{ width: 50 }} size="small" active />
          </Flex>
          <Flex gap="small" id="actions" className="self-align-end">
            <Skeleton.Avatar shape="square" active />
            <Skeleton.Avatar shape="square" active />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}

export default SkeletonBook
