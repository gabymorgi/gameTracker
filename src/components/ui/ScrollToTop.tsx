import { ArrowUpOutlined } from '@ant-design/icons'
import { Button } from 'antd'

function ScrollToTop() {
  return (
    <Button
      shape="circle"
      type="primary"
      icon={<ArrowUpOutlined />}
      className="fixed bottom-4 right-4"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    />
  )
}

export default ScrollToTop
