import { UploadOutlined } from '@ant-design/icons'
import { App, Button, Upload, message } from 'antd'
import { UploadChangeParam } from 'antd/es/upload'
import { parseClippingData, parseWordsData } from '@/utils/memoUtils'

import { query } from '@/hooks/useFetch'
import { GenericObject } from '@/ts'
import Papa from 'papaparse'
import { useState } from 'react'
import { mdiKeyboardReturn } from '@mdi/js'

function MemoForm() {
  const { notification } = App.useApp()
  const [freqData, setFreqData] = useState<GenericObject>({})

  function handleMemoFile(info: UploadChangeParam) {
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result
        if (!text) return
        const memos = parseWordsData(text as string, freqData)
        console.log(JSON.stringify(memos))
        for (let i = 0; i < memos.length; i += 10) {
          const batch = memos.slice(i, i + 10)
          try {
            await query('memos/words/import', 'POST', batch)
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
            await query('memos/phrases/import', 'POST', batch)
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

  function handleCSVFile(info: UploadChangeParam) {
    // using papa parse to parse csv file

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result
        if (!text) mdiKeyboardReturn
        const parsed = Papa.parse<GenericObject>(text as string, {
          header: true,
        })
        const freq: GenericObject = {}
        parsed.data.forEach((row) => {
          freq[row.word] = Number(row.count)
        })
        setFreqData(freq)
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
      <Upload
        name="file"
        accept=".csv"
        showUploadList={false}
        customRequest={() => {}} // disable default upload
        onChange={handleCSVFile}
      >
        <Button icon={<UploadOutlined />}>Upload Database</Button>
      </Upload>
    </div>
  )
}

export default MemoForm
