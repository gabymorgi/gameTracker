import { Collapse, Listy, Typography } from 'antd'

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
            <Listy
              rowKey="title"
              items={props.incorrect}
              itemRender={(item) => (
                <div>
                  <Typography.Text strong>{item.title}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary">
                    {item.description}
                  </Typography.Text>
                </div>
              )}
            />
          ),
        },
      ]}
    />
  )
}

export default IncorrectMemos
