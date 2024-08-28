import { Card, Flex, Skeleton } from 'antd'
import { TreeNode } from '../ui/Tree'

export function SkeletonChangelogNodeLeaf() {
  return (
    <Card size="small">
      <Flex
        gap="middle"
        justify="space-between"
        align="center"
        className="w-full"
      >
        <Skeleton.Image style={{ width: 140, height: 65 }} active />
        <Flex vertical gap="middle" align="center">
          <Skeleton.Button style={{ width: 125 }} size="small" active />
          <Flex gap="middle" align="center">
            <Skeleton.Button style={{ width: 60 }} size="small" active />
            <Skeleton.Button style={{ width: 35 }} size="small" active />
            <Skeleton.Button style={{ width: 80 }} size="small" active />
            <Skeleton.Button style={{ width: 30 }} size="small" active />
          </Flex>
        </Flex>
        <Skeleton.Button style={{ width: 65 }} size="small" active />
      </Flex>
    </Card>
  )
}

export function skeletonChangelogMonthNode(
  elementKey: string,
  cant?: number,
): TreeNode {
  return {
    key: elementKey,
    title: <Skeleton.Button style={{ width: 100 }} size="large" active />,
    extra: <Skeleton.Button style={{ width: 110 }} size="small" active />,
    children: Array.from({ length: cant || 3 }, (_, i) => ({
      element: <SkeletonChangelogNodeLeaf />,
      key: `loading-${i}`,
    })),
  }
}

export function skeletonChangelogYearNode(
  elementKey: string,
  cant?: number,
): TreeNode {
  return {
    key: elementKey,
    title: <Skeleton.Button style={{ width: 100 }} size="large" active />,
    extra: <Skeleton.Button style={{ width: 110 }} size="small" active />,
    children: Array.from({ length: cant || 2 }, (_, i) =>
      skeletonChangelogMonthNode(`loading-month-${i}`, 2),
    ),
  }
}
