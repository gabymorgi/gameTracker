import { Card, Divider, Flex, Skeleton } from 'antd'

function SkeletonGame() {
  return (
    <Card size="small">
      <Flex vertical gap="small" align="center" className="h-full">
        <Skeleton.Image style={{ width: 200 }} active />
        <Flex
          justify="space-between"
          align="center"
          className="text-center w-full"
        >
          <Skeleton.Button style={{ width: 65 }} size="small" active />
          <Divider type="vertical" />
          <Skeleton.Button style={{ width: 50 }} size="small" active />
          <Divider type="vertical" />
          <Skeleton.Button style={{ width: 65 }} size="small" active />
        </Flex>
        <Skeleton.Button block shape="round" active />
        <Skeleton.Button size="small" block shape="round" active />
        <Flex gap="middle">
          <Skeleton.Button shape="round" active />
          <Skeleton.Button shape="round" active />
        </Flex>
        <Flex gap="small" id="actions" className="self-align-end">
          <Skeleton.Avatar shape="square" active />
          <Skeleton.Avatar shape="square" active />
        </Flex>
      </Flex>
    </Card>
  )
}

export default SkeletonGame
