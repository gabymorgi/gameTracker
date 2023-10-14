import { Memo } from "@/ts/books";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  List,
  Popconfirm,
  Tag,
} from "antd";
import { useState } from "react";
import SpoilerStatistic from "./SpoilerStatistic";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { Options, query } from "@/hooks/useFetch";
import { EndPoint } from "@/ts";
import { CopyToClipboard } from "react-copy-to-clipboard";

function getMemoText(memo: Memo) {
  return `Perfecto! Sigamos con otra
${memo.word}
${memo.phrases.map((phrase) => `- ${phrase.content}`).join("\n")}`;
}


interface MemoCardProps {
  memo: Memo;
  handleDelete: (id: string) => void;
  handleEdit: (memo: Memo) => void;
}

function MemoCard(props: MemoCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function onFinishMemo(values: any) {
    props.handleEdit(values);
    await query(EndPoint.WORDS, Options.PUT, {}, values);
    setIsEditing(false);
  }

  async function handleDeleteMemo() {
    await query(EndPoint.WORDS, Options.DELETE, {
      id: props.memo.id,
    });
    props.handleDelete(props.memo.id);
  }

  async function handleSuccess(success: number) {
    await query(
      EndPoint.WORDS,
      Options.PUT,
      {},
      {
        id: props.memo.id,
        success: success,
        fails: 1 - success,
      }
    );
    props.handleDelete(props.memo.id);
  }

  return (
    <div>
      {isEditing ? (
        <Card
          title={props.memo.word}
          extra={
            <div className="flex gap-8">
              <Tag>
                {props.memo.success.toFixed(2)} / {props.memo.fails.toFixed(2)}
              </Tag>
              <Tag>Priority {props.memo.priority}</Tag>
              <CopyToClipboard text={getMemoText(props.memo)}>
                <Button size="small" icon={<CopyOutlined />} />
              </CopyToClipboard>
            </div>
          }
          actions={[
            <Button key="cancel" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              htmlType="submit"
              form="memo-form"
            >
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
                      <Form.Item
                        name={[name, "translation"]}
                        label="Translation"
                      >
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
      ) : (
        <Card
          title={props.memo.word}
          extra={
            <div className="flex gap-8">
              <Tag>
                {props.memo.success.toFixed(2)} / {props.memo.fails.toFixed(2)}
              </Tag>
              <Tag>Priority {props.memo.priority}</Tag>
              <CopyToClipboard text={getMemoText(props.memo)}>
                <Button size="small" icon={<CopyOutlined />} />
              </CopyToClipboard>
            </div>
          }
        >
          <SpoilerStatistic
            title={props.memo.pronunciation || "-"}
            value={props.memo.definition}
          />
          <Divider />
          <List
            dataSource={props.memo.phrases}
            renderItem={(phrase) => (
              <List.Item>
                <SpoilerStatistic
                  title={phrase.content}
                  value={phrase.translation}
                />
              </List.Item>
            )}
          />
          <Divider />
          <div className="flex gap-16 justify-between">
            <div className="flex gap-8">
              {Array.from(Array(11).keys()).map((i) => (
                <Button key={i} onClick={() => handleSuccess(i / 10)}>
                  {i}
                </Button>
              ))}
            </div>
            <div className="flex gap-8">
              <Button key="Edit" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Popconfirm
                key="Delete"
                title="Are you sure to delete this memo and phrases?"
                onConfirm={handleDeleteMemo}
                okText="Yes"
                cancelText="No"
              >
                <Button danger key="Delete">
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default MemoCard;
