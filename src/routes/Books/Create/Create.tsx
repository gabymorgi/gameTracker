import WordForm from './WordForm'
import ImportMemoForm from './ImportMemoForm'
import { Flex } from 'antd'

function CreateMemo() {
  return (
    <Flex vertical gap="middle">
      <ImportMemoForm />
      <WordForm />
    </Flex>
  )
}

export default CreateMemo
