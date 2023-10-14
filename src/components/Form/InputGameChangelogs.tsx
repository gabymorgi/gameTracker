import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  InputProps,
  Row,
} from "antd";
import { FormChangelogI } from "@/ts/index";
import { NamePath } from "antd/es/form/interface";
import { formattedPathName } from "@/utils/format";
import Img from "../ui/Img";
import { InputChangelog } from "./InputChangelog";

interface InputGameChangelogsProps extends Omit<InputProps, "value" | "onChange"> {
  value?: FormChangelogI;
  onChange?: (value: FormChangelogI) => void;
  remove?: () => void;
  fieldName?: NamePath;
}

export function InputGameChangelogs(props: InputGameChangelogsProps) {
  const fieldNames = formattedPathName(props.fieldName);

  return (
    <Card
      title={props.value?.name}
      extra={
        <Img
          width="200px"
          style={{ objectFit: "cover" }}
          src={props.value?.imageUrl || ""}
          alt="cover"
          $errorComponent={<span className="font-16">Error</span>}
        />
      }
    >
      <Form.List name={[...fieldNames, "changelogs"]}>
        {(fields, { add, remove }, { errors }) => {
          return (
            <Row>
              {fields.map(({ key, name }) => {
                return (
                  <Col span={24} key={key}>
                    <Form.Item name={name}>
                      <InputChangelog fieldName={name} remove={() => remove(name)} />
                    </Form.Item>
                  </Col>
                );
              })}
              <Col span={24}>
                <Form.ErrorList errors={errors} />
              </Col>
              <Col span={24}>
                <Button
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add changelog
                </Button>
              </Col>
            </Row>
          );
        }}
      </Form.List>
    </Card>
  );
}
