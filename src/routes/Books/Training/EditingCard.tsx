import { Memo } from "@/ts/books";
import { Button, Card, Form, Input, InputNumber, Tag } from "antd";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { Options, query } from "@/hooks/useFetch";
import { EndPoint } from "@/ts";
import { CopyToClipboard } from "react-copy-to-clipboard";

function getGPTMemoText(memo: Memo) {
  return `Perfecto! Sigamos con otra
${memo.word}
${memo.phrases.map((phrase) => `- ${phrase.content}`).join("\n")}`;
}

interface EditingCardProps {
  memo: Memo;
  handleEdit: (memo: Memo) => void;
  handleClose: () => void;
}

function EditingCard(props: EditingCardProps) {
  async function onFinishMemo(values: any) {
    await query(EndPoint.WORDS, Options.PUT, {}, values);
    props.handleEdit(values);
    props.handleClose();
  }

  return (
    <Card
      title={props.memo.word}
      extra={
        <div className="flex gap-8">
          <Tag>Priority {props.memo.priority}</Tag>
          <CopyToClipboard text={getGPTMemoText(props.memo)}>
            <Button size="small" icon={<CopyOutlined />} />
          </CopyToClipboard>
        </div>
      }
      actions={[
        <Button key="cancel" onClick={props.handleClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" htmlType="submit" form="memo-form">
          Save
        </Button>,
      ]}
    >
      <Form
        id="memo-form"
        layout="vertical"
        initialValues={props.memo}
        onFinish={onFinishMemo}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Pronunciation" name="pronunciation">
          <Input />
        </Form.Item>
        <Form.Item label="Definition" name="definition">
          <TextArea autoSize={{ minRows: 3 }} placeholder="Definition" />
        </Form.Item>
        <Form.List name="phrases">
          {(fields, { add, remove }, { errors }) => (
            <div className="flex flex-col gap-16">
              {fields.map(({ key, name }) => (
                <Card key={key}>
                  <Form.Item name={[name, "id"]} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name={[name, "content"]} label="Content">
                    <Input />
                  </Form.Item>
                  <Form.Item name={[name, "translation"]} label="Translation">
                    <Input />
                  </Form.Item>
                  <Button
                    className="absolute top-0 right-0"
                    danger
                    type="default"
                    onClick={() => remove(name)}
                    icon={<DeleteOutlined />}
                  />
                </Card>
              ))}
              <Form.ErrorList errors={errors} />
              <Form.Item>
                <Button
                  type="default"
                  onClick={() => add()}
                  icon={<EditOutlined />}
                >
                  Add phrase
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        <Form.Item label="Priority" name="priority">
          <InputNumber />
        </Form.Item>
      </Form>
    </Card>
  );
}

export default EditingCard;
