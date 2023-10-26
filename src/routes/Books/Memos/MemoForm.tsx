import { UploadOutlined } from '@ant-design/icons'
import { App, Button, Upload, message } from 'antd'
import { UploadChangeParam } from 'antd/es/upload'
import { parseClippingData, parseWordsData } from '@/utils/memoUtils'

import { Options, query } from '@/hooks/useFetch'
import { EndPoint } from '@/ts'

function MemoForm() {
  const { notification } = App.useApp()

  function handleMemoFile(info: UploadChangeParam) {
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result
        if (!text) return
        const memos = parseWordsData(text as string)
        for (let i = 0; i < memos.length; i += 10) {
          const batch = memos.slice(i, i + 10)
          try {
            await query(EndPoint.WORDS, Options.POST, {}, batch)
          } catch (e) {
            if (e instanceof Error) {
              message.error(e.message)
            }
            break
          }
          notification.success({
            message: 'Upload success',
            description: `Batch ${i} / ${memos.length} done`,
          })
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
        message.success('Upload success')
      }
      if (!info.file.originFileObj) throw new Error('No file')
      reader.readAsText(info.file.originFileObj) // <-- Lee el archivo como texto
    } catch (e: unknown) {
      if (e instanceof Error) {
        notification.error({
          message: 'File upload failed',
          description: e.message,
        })
      }
    }
  }

  function handleClippingFile(info: UploadChangeParam) {
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result
        if (!text) return
        const clippings = parseClippingData(text as string)
        const parsed = clippings.map((clip) => ({
          content: clip,
        }))
        for (let i = 0; i < parsed.length; i += 10) {
          const batch = parsed.slice(i, i + 10)
          try {
            await query(EndPoint.PHRASES, Options.POST, {}, batch)
          } catch (e) {
            if (e instanceof Error) {
              message.error(e.message)
            }
            break
          }
          notification.success({
            message: 'Upload success',
            description: `Batch ${i} / ${parsed.length} done`,
          })
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
        message.success('Upload success')
      }
      if (!info.file.originFileObj) throw new Error('No file')
      reader.readAsText(info.file.originFileObj) // <-- Lee el archivo como texto
    } catch (e: unknown) {
      if (e instanceof Error) {
        notification.error({
          message: 'File upload failed',
          description: e.message,
        })
      }
    }
  }

  return (
    <div className="flex gap-16">
      <Upload
        name="file"
        accept=".txt"
        showUploadList={false}
        customRequest={() => {}} // disable default upload
        onChange={handleMemoFile}
      >
        <Button icon={<UploadOutlined />}>Upload word</Button>
      </Upload>
      <Upload
        name="file"
        accept=".txt"
        showUploadList={false}
        customRequest={() => {}} // disable default upload
        onChange={handleClippingFile}
      >
        <Button icon={<UploadOutlined />}>Upload clipping</Button>
      </Upload>
    </div>
  )
}

export default MemoForm
