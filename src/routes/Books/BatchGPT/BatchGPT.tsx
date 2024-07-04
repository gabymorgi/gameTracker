/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { GenericObject } from '@/ts'
import { Button, Flex } from 'antd'
import { query } from '@/hooks/useFetch'
import { UploadChangeParam } from 'antd/es/upload'
import { Upload } from 'antd/lib'
import { UploadOutlined } from '@ant-design/icons'

const batch_size = 10

function getBatches(values: GenericObject[]) {
  const batches: GenericObject[][] = []
  for (let i = 0; i < values.length; i += batch_size) {
    batches.push(values.slice(i, i + batch_size))
  }
  return batches
}

function jsonToJsonL(json: GenericObject[]) {
  return json.map((item) => JSON.stringify(item)).join('\n')
}

const downloadFile = (content: any, name: string) => {
  // Crear un Blob con los datos en formato JSONL
  const blob = new Blob([content], { type: 'application/jsonl' })
  const url = URL.createObjectURL(blob)

  // Crear un enlace para descargar el archivo
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()

  // Limpiar la URL y remover el enlace
  URL.revokeObjectURL(url)
  document.body.removeChild(link)
}

function BatchGPT() {
  async function getWordsFromBackend() {
    const res = await query('words/get-batch')
    downloadFile(jsonToJsonL(res), 'words.jsonl')
  }

  async function getPhrasesFromBackend() {
    const res = await query('phrases/get-batch')
    downloadFile(jsonToJsonL(res), 'tran.jsonl')
  }

  function handleFile(
    info: UploadChangeParam,
    callback: (items: any) => void,
    isJsonL: boolean,
  ) {
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result
        if (!text) return

        if (isJsonL) {
          const items = (text as string)
            .split(/\r?\n/)
            .filter((line) => line.trim()) // Elimina líneas vacías
            .map((line) => JSON.parse(line))

          callback(items)
        } else {
          callback(JSON.parse(text as string))
        }
      }
      if (!info.file.originFileObj) throw new Error('No file')
      reader.readAsText(info.file.originFileObj) // Lee el archivo como texto
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message)
      }
    }
  }

  async function handleDefinitionBatch(values: any) {
    const batches = getBatches(values)

    for (let i = 0; i < batches.length; i++) {
      await query('words/definition-batch', { batch: batches[i] })
      console.log(`Batch processed ${i + 1}/${batches.length}`)
    }
  }

  async function handlePhraseBatch(values: any) {
    const batchesDelete = getBatches(values.deleteData)

    for (let i = 0; i < batchesDelete.length; i++) {
      await query('phrases/delete-batch', { ids: batchesDelete[i] })
      console.log(`Delete Batch processed ${i + 1}/${batchesDelete.length}`)
    }

    const batchesCreate = getBatches(values.createData)
    for (let i = 0; i < batchesCreate.length; i++) {
      await query('phrases/create-batch', { batch: batchesCreate[i] })
      console.log(`Create Batch processed ${i + 1}/${batchesCreate.length}`)
    }
  }

  async function handleTranslationBatch(values: any) {
    const batches = getBatches(values)

    for (let i = 0; i < batches.length; i++) {
      await query('words/definition-batch', { batch: batches[i] })
      console.log(`Batch processed ${i + 1}/${batches.length}`)
    }
  }

  return (
    <Flex vertical gap="middle">
      <Flex gap="middle">
        <Button onClick={getWordsFromBackend}>Get words from backend</Button>
        <Button onClick={getPhrasesFromBackend}>
          Get phrases from backend
        </Button>
      </Flex>
      <Flex gap="middle">
        <Upload
          name="word"
          accept=".jsonl"
          showUploadList={false}
          customRequest={() => {}} // disable default upload
          onChange={(info) => handleFile(info, handleDefinitionBatch, true)}
        >
          <Button icon={<UploadOutlined />}>Upload word batch</Button>
        </Upload>
        <Upload
          name="phrase"
          accept=".json"
          showUploadList={false}
          customRequest={() => {}} // disable default upload
          onChange={(info) => handleFile(info, handlePhraseBatch, false)}
        >
          <Button icon={<UploadOutlined />}>Upload phrase batch</Button>
        </Upload>
        <Upload
          name="translation"
          accept=".jsonl"
          showUploadList={false}
          customRequest={() => {}} // disable default upload
          onChange={(info) => handleFile(info, handleTranslationBatch, true)}
        >
          <Button icon={<UploadOutlined />}>Upload translation batch</Button>
        </Upload>
      </Flex>
    </Flex>
  )
}

export default BatchGPT
