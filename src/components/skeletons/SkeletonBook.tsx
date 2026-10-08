import { Card, Divider, Flex, Grid, Skeleton } from 'antd'
import { ComponentRef, forwardRef } from 'react'

const SkeletonBook = forwardRef<ComponentRef<typeof Card>>(
  function SkeletonBook(_, ref) {
    const breakPoints = Grid.useBreakpoint()
    const width = breakPoints.lg ? 160 : 120
    return (
      <Card
        size="small"
        ref={ref}
        title={
          <Flex gap="middle" style={{ padding: '12px 0' }}>
            <Skeleton.Image style={{ width: width, height: 210 }} active />
            <Flex vertical gap="middle" align="stretch" className="flex-grow">
              <Skeleton.Button block size="small" active />
              <Skeleton.Button block size="small" active />
              <Flex justify="space-between" align="center">
                <Skeleton.Button style={{ width: 70 }} size="small" active />
                <Divider vertical />
                <Skeleton.Button style={{ width: 70 }} size="small" active />
              </Flex>
              <Flex justify="space-between" align="center">
                <Skeleton.Button style={{ width: 50 }} size="small" active />
                <Skeleton.Button style={{ width: 60 }} size="small" active />
              </Flex>
              <Flex gap="small" className="self-align-end mt-auto">
                <Skeleton.Avatar shape="square" active />
                <Skeleton.Avatar shape="square" active />
              </Flex>
            </Flex>
          </Flex>
        }
      >
        <Flex vertical gap="small">
          <Flex justify="space-between">
            <Skeleton.Button style={{ width: 70 }} size="small" active />
            <Skeleton.Button style={{ width: 50 }} size="small" active />
          </Flex>
          <Flex justify="space-between">
            <Skeleton.Button style={{ width: 70 }} size="small" active />
            <Skeleton.Button style={{ width: 50 }} size="small" active />
          </Flex>
        </Flex>
      </Card>
    )
  },
)

export default SkeletonBook
