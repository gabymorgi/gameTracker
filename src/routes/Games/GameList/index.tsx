// import { ChartComponent } from './Chart'
// import { Filters } from './Filters'
import { Layout } from 'antd'
// import GameTable from './GameTable'
import { Content } from 'antd/es/layout/layout'
import { useState } from 'react'

const Index = () => {
  const [value, setValue] = useState('')

  async function fetchGames() {
    const res = await fetch(value)
    console.log(res)
    const data = await res.json()
    console.log(data)
  }

  return (
    <Layout>
      <Content className="content">
        <div className="flex flex-col gap-16">
          <input value={value} onChange={(e) => setValue(e.target.value)} />
          <button onClick={fetchGames}>Create Game</button>
          {/* <ChartComponent /> */}
          {/* <Filters /> */}
          {/* <GameTable /> */}
        </div>
      </Content>
    </Layout>
  )
}

export default Index
