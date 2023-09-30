import { Button, Form, InputNumber, Popconfirm, Select, Space } from "antd";
import { useContext, useState } from "react";
import { formatPlayedTime, formattedDate } from "@/utils/format";
import {
  CloseOutlined,
  DeleteFilled,
  EditFilled,
  SaveFilled,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { numberToDate } from "@/utils/format";
import Icon from "@mdi/react";
import { mdiSeal } from "@mdi/js";
import { InputHours } from "@/components/Form/InputHours";
import { GlobalContext } from "@/contexts/GlobalContext";
import { DatePicker } from "@/components/ui/DatePicker";
import styled from "styled-components";

const StyledFormContainer = styled.div`
  display: flex;
  gap: 8px;

  .ant-form-item {
    margin-inline-end: 0;
  }

  .ant-picker {
    width: 100px;
  }
  .ant-input-number{
    width: 50px;
  }
  .ant-select-single.ant-select-show-arrow .ant-select-selection-item{
    padding-inline-end: 0;
  }
`;

interface ChangelogItemI {
  changelog: {
    id: string;
    achievements: number;
    createdAt: number;
    hours: number;
    stateId: string;
  };
  isFirst?: boolean;
  isLast?: boolean;
  onFinish: (values: any, id?: string) => void;
  onDelete: () => void;
  onMergeUp: () => void;
  onMergeDown: () => void;
}

const ChangelogItem = (props: ChangelogItemI) => {
  const { states } = useContext(GlobalContext);
  const [isEdit, setIsEdit] = useState(false);

  function handleFinish(values: any) {
    props.onFinish(values);
    setIsEdit(!isEdit);
  }

  return isEdit ? (
    <Form
      className="w-full flex justify-between items-center gap-16"
      id="changelog-item-form"
      layout="inline"
      initialValues={props.changelog}
      onFinish={handleFinish}
    >
      <StyledFormContainer>
        <Form.Item name="createdAt" rules={[{ required: true }]}>
          <DatePicker suffixIcon />
        </Form.Item>
        <Form.Item name="achievements" rules={[{ required: true }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item name="stateId" rules={[{ required: true }]}>
          <Select suffixIcon>
            {states &&
              Object.keys(states).map((key) => (
                <Select.Option key={key} value={key}>
                  {key}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="hours" rules={[{ required: true }]}>
          <InputHours />
        </Form.Item>
      </StyledFormContainer>
      <Space.Compact>
        <Button
          type="primary"
          icon={<SaveFilled />}
          htmlType="submit"
          form="changelog-item-form"
        />
        <Button
          type="default"
          danger
          icon={<CloseOutlined />}
          onClick={() => setIsEdit(!isEdit)}
        />
      </Space.Compact>
    </Form>
  ) : (
    <div className="w-full flex justify-between items-center gap-16">
      <div className="flex gap-16">
        <span>{formattedDate(numberToDate(props.changelog.createdAt))}</span>
        <span className="flex items-center gap-4">
          <span>{props.changelog.achievements}</span>
          <Icon path={mdiSeal} size="16px" />
        </span>
        <span>{props.changelog.stateId}</span>
        <span>{formatPlayedTime(props.changelog.hours)}</span>
      </div>
      <Space.Compact>
        <Popconfirm
          title="Merge changelog"
          description="Are you sure to DELETE and MERGE UP this changelog?"
          onConfirm={props.onMergeUp}
          okText="Yes"
          cancelText="No"
          disabled={props.isFirst}
        >
          <Button
            type="text"
            icon={<VerticalAlignTopOutlined />}
            disabled={props.isFirst}
          />
        </Popconfirm>
        <Popconfirm
          title="Merge changelog"
          description="Are you sure to DELETE and MERGE DOWN this changelog?"
          onConfirm={props.onMergeDown}
          okText="Yes"
          cancelText="No"
          disabled={props.isLast}
        >
          <Button
            type="text"
            icon={<VerticalAlignBottomOutlined />}
            disabled={props.isLast}
          />
        </Popconfirm>
        <Button
          type="text"
          icon={<EditFilled />}
          onClick={() => setIsEdit(!isEdit)}
        />
        <Popconfirm
          title="Delete changelog"
          description="Are you sure to delete this changelog?"
          onConfirm={props.onDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteFilled />} />
        </Popconfirm>
      </Space.Compact>
    </div>
  );
};

export default ChangelogItem;
