import { List, Skeleton } from "antd";

interface SkeletonGameChangelogProps {
  cant?: number;
}

function SkeletonGameChangelog(props: SkeletonGameChangelogProps) {
  return (
    <List
      size="small"
      header={
        <div className="flex items-center justify-between gap-16">
          <Skeleton.Image style={{ width: 160, height: 75 }} active />
          <Skeleton.Button style={{ width: 150 }} size="large" active />
        </div>
      }
      bordered
      dataSource={Array.from({ length: props.cant || 5 }).map((_, index) => (
        <div
          key={index}
          className="w-full flex justify-between items-center gap-16"
        >
          <div className="flex gap-16">
            <Skeleton.Button style={{ width: 75 }} size="small" active />
            <Skeleton.Button style={{ width: 25 }} size="small" active />
            <Skeleton.Button style={{ width: 75 }} size="small" active />
            <Skeleton.Button style={{ width: 75 }} size="small" active />
          </div>
          <Skeleton.Button style={{ width: 125 }} size="small" active />
        </div>
      ))}
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
  )
}

export default SkeletonGameChangelog
