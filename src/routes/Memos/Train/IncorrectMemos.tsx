import { Collapse, List } from 'antd'

export interface IncorrectItem {
  title: string
  description: string
}

interface Props {
  left: number
  correct: number
  banned: number
  incorrect: IncorrectItem[]
}

function IncorrectMemos(props: Props) {
  return (
    <Collapse
      items={[
        {
          key: '1',
          label: `${props.left} left | ${props.correct} correct | ${props.incorrect.length} incorrect`,
          extra: `banned ${props.banned}`,
          children: (
            <List
              dataSource={props.incorrect}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          ),
        },
      ]}
    />
  )
}

export default IncorrectMemos
