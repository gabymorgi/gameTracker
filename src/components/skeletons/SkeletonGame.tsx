import { Skeleton } from "antd";

function SkeletonGame() {
  return (
    <div className='card'>
      <div id="name">
        <Skeleton.Image style={{ width: 200 }} active />
      </div>
      <div id="date">
        <Skeleton.Button style={{ width: 100 }} size="small" active />
        <Skeleton.Button style={{ width: 100 }} size="small" active />
      </div>
      <div id="state"><Skeleton.Button block shape="round" active /></div>
      <div id="hours"><Skeleton.Button style={{ width: 50 }} size="small" active /></div>
      <div id="achievements"><Skeleton.Input block active /></div>
      <div id="tags">
        <div className='flex gap-16'>
          <Skeleton.Button shape="round" active />
          <Skeleton.Button shape="round" active />
        </div>
      </div>
      <div id="score">
        <label>
          <Skeleton.Button size="small" active />
          <Skeleton.Input size="small" block active />
        </label>
        <Skeleton.Input size="small" block active />
      </div>
      <div id="actions" className='flex gap-8'>
        <Skeleton.Avatar shape="square" active />
        <Skeleton.Avatar shape="square" active />
      </div>
    </div>
  )
}

export default SkeletonGame
