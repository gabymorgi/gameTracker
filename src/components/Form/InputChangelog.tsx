import { MinusCircleFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  InputProps,
  Row,
  Select,
} from "antd";
import { DatePicker } from "@/components/ui/DatePicker";
import { InputHours } from "@/components/Form/InputHours";
import { FormGameI } from "@/ts/index";
import { NamePath } from "antd/es/form/interface";
import { formattedPathName } from "@/utils/format";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";

interface InputChangelogProps extends Omit<InputProps, "value" | "onChange"> {
  value?: FormGameI;
  onChange?: (value: FormGameI) => void;
  remove?: () => void;
  fieldName?: NamePath;
}

export function InputChangelog(props: InputChangelogProps) {
  const { states } = useContext(GlobalContext);

  const fieldNames = formattedPathName(props.fieldName);

  return (
    <Row gutter={[16, 0]} align="middle">
      <Col span={5}>
        <Form.Item
          label="Created At"
          name={[...fieldNames, "createdAt"]}
          rules={[{ required: true }]}
        >
          <DatePicker picker="month" />
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item
          name={[...fieldNames, "state"]}
          label="State"
          rules={[{ required: true }]}
        >
          <Select allowClear>
            {states &&
              Object.keys(states).map((key) => (
                <Select.Option key={key} value={key}>
                  {key}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item label="Achievements" name={[...fieldNames, "achievements"]}>
          <InputNumber min={0} />
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item label="Hours" name={[...fieldNames, "hours"]}>
          <InputHours />
        </Form.Item>
      </Col>
      {props.remove ? (
        <Col span={4} className="flex justify-end">
          <Button
            danger
            type="default"
            onClick={() => props.remove?.()}
            icon={<MinusCircleFilled />}
          >
            Remove
          </Button>
        </Col>
      ) : null}
    </Row>
  );
}
