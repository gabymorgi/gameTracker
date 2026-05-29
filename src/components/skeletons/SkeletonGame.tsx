import { FullHeightCard } from '@/styles/TableStyles'
import { Divider, Flex, Skeleton } from 'antd'
import { forwardRef, type ComponentRef } from 'react'

const SkeletonGame = forwardRef<ComponentRef<typeof FullHeightCard>>(
  function SkeletonGame(_, ref) {
    return (
      <FullHeightCard size="small" ref={ref}>
        <Flex vertical gap="small" align="center" className="h-full">
          <Skeleton.Image
            active
            styles={{
              content: {
                width: '100%',
              },
              root: {
                width: '100%',
              },
            }}
          />
          <Flex
            justify="space-between"
            align="center"
            className="text-center w-full"
          >
            <Skeleton.Button style={{ flex: 1 }} size="small" active block />
            <Divider vertical />
            <Skeleton.Button style={{ flex: 1 }} size="small" active block />
          </Flex>
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
      </FullHeightCard>
    )
  },
)

SkeletonGame.displayName = 'SkeletonGame'

export default SkeletonGame
