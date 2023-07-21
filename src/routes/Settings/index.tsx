import { App, Button, Form, Input } from 'antd'
import { Store } from 'antd/lib/form/interface'
import styled from 'styled-components'
import { TagsContext } from '@/contexts/TagsContext'
import { FlexSection } from '@/components/ui/Layout'
import { InputTag } from '@/components/Form/InputTag'
import { Tag } from '@/components/ui/Tags'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { mutationCreateAggregates } from '@/back/mutations/20230124_createAggregates'
import { DownloadDB } from '@/components/ActionButtons/DownloadDB'
import { mutationCreateSettingsVars } from '@/back/mutations/20230425_createSettingsVars'

type CollectionType = any

const CloseButton = styled.div`
  cursor: pointer;
`

const Settings: React.FC = () => {
  const { notification } = App.useApp();
  const { tags, states, loading, createVal, deleteVal } =
    useContext(TagsContext)
  const [mutationLoading, setMutationLoading] = useState(false)
  const handleSubmit = async (
    collection: CollectionType,
    values: Store
  ) => {
    createVal(collection, values.name, values.hue)
  }
  const handleDelete = async (
    collection: CollectionType,
    id: string
  ) => {
    deleteVal(collection, id)
  }
  const handleMutation = async (callback: (notification: any) => Promise<void>) => {
    setMutationLoading(true)
    await callback(notification)
    setMutationLoading(false)
  }
  return (
    <FlexSection gutter={16} direction='column' className='p-16'>
      <div>
        <Button>
          <Link to='/'>Back to home</Link>
        </Button>
      </div>
      <h2>Mutations</h2>
      <div className='flex flex-wrap gap-16'>
        <Button onClick={() => handleMutation(mutationCreateAggregates)} loading={mutationLoading}>
          Create Aggregates
        </Button>
        <Button onClick={() => handleMutation(mutationCreateSettingsVars)} loading={mutationLoading}>
          Create Settings Vars
        </Button>
        <DownloadDB />
      </div>
      <h2>Tags</h2>
      <FlexSection gutter={16} className='flex-wrap'>
        {tags &&
          Object.entries(tags).map(([name, value]) => (
            <Tag key={name} hue={value}>
              {name}{' '}
              <CloseButton
                onClick={() =>
                  handleDelete(undefined, name) //CollectionType.Tags, name)
                }
              >
                x
              </CloseButton>
            </Tag>
          ))}
      </FlexSection>
      <Form
        onFinish={(values) =>
          handleSubmit(undefined, values) //CollectionType.Tags, values)
        }
        layout='horizontal'
      >
        <Form.Item
          label='Name'
          name='name'
          rules={[{ required: true, message: 'Please input a name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label='Hue' name='hue' className='flex-grow'>
          <InputTag />
        </Form.Item>
        <Button
          disabled={loading}
          loading={loading}
          htmlType='submit'
        >
          Add
        </Button>
      </Form>
      <h2>States</h2>
      <FlexSection gutter={16} className='flex-wrap'>
        {states &&
          Object.entries(states).map(([name, value]) => (
            <Tag key={name} hue={value}>
              {name}{' '}
              <CloseButton
                onClick={() =>
                  handleDelete(undefined, name) //CollectionType.States, name)
                }
              >
                x
              </CloseButton>
            </Tag>
          ))}
      </FlexSection>
      <Form
        onFinish={(values) =>
          handleSubmit(undefined, values) //CollectionType.States, values)
        }
        layout='horizontal'
      >
        <Form.Item
          label='Name'
          name='name'
          rules={[{ required: true, message: 'Please input a name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label='Hue' name='hue' className='flex-grow'>
          <InputTag />
        </Form.Item>
        <Button
          disabled={loading}
          loading={loading}
          htmlType='submit'
        >
          Add
        </Button>
      </Form>
    </FlexSection>
  )
}

export default Settings
