import { Card, Flex, Skeleton } from 'antd'
import { ComponentRef, forwardRef } from 'react'
import styled from 'styled-components'

const GroupGrid = styled.div<{ $cant: number }>`
  display: grid;
  gap: 40px; // 16px main grid gap + 2 * 12px card padding
  grid-template-columns: repeat(${({ $cant }) => $cant}, minmax(0, 1fr));
`

const SkeletonBookChangelog = forwardRef<ComponentRef<typeof Card>>(
  function SkeletonBookChangelog(_, ref) {
    return (
      <Card size="small" className="h-full" ref={ref}>
        <Flex vertical gap="small" align="stretch">
          <Skeleton.Node
            active
            style={{ width: '100%', height: 'auto', aspectRatio: '2/3' }}
          >
            {null}
          </Skeleton.Node>
          <Flex justify="center">
            <Skeleton.Button size="small" style={{ width: 120 }} active />
          </Flex>
          <Flex justify="space-between" align="center">
            <Skeleton.Button size="small" style={{ width: 50 }} active />
            <Skeleton.Button size="small" style={{ width: 80 }} active />
          </Flex>
        </Flex>
      </Card>
    )
  },
)

interface SkeletonBookChangelogGroupProps {
  cant: number
}

export const SkeletonBookChangelogGroup = forwardRef<
  ComponentRef<typeof Card>,
  SkeletonBookChangelogGroupProps
>(function SkeletonBookChangelogGroup({ cant }, ref) {
  return (
    <Card
      ref={ref}
      size="small"
      title={<Skeleton.Button size="small" style={{ width: 100 }} active />}
      extra={<Skeleton.Button size="small" style={{ width: 80 }} active />}
      style={{ gridColumn: `span ${cant}` }}
    >
      <GroupGrid $cant={cant}>
        {Array.from({ length: cant }, (_, i) => (
          <SkeletonBookChangelog key={i} />
        ))}
      </GroupGrid>
    </Card>
  )
})
