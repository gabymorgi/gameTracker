import { Button, Card, Col, Form, Input, Row } from "antd";
import { Store } from "antd/lib/form/interface";
import styled from "styled-components";
import { GlobalContext } from "@/contexts/GlobalContext";
import { FlexSection } from "@/components/ui/Layout";
import { InputTag } from "@/components/Form/InputTag";
import { Tag } from "@/components/ui/Tags";
import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EndPoint, GameTagI } from "@/ts";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { CirclePacking } from "@/components/ui/CirclePacking";
import gameTagsData from "@/back/gameTags.json";
import { getClusteringData } from "@/utils/tagClustering";
import HierarchicalEdgeBundling from "@/components/ui/HierarchicalEdgeBundling";

const CloseButton = styled.div`
  cursor: pointer;
`;

const Settings: React.FC = () => {
  const { tags, states, loading, upsertVal, deleteVal } =
    useContext(GlobalContext);
  const [gameTags, setGameTags] = useState<GameTagI[]>()
  const handleSubmit = async (
    collection: EndPoint.TAGS | EndPoint.STATES,
    values: Store
  ) => {
    upsertVal(collection, { id: values.name, hue: values.hue });
  };
  const handleDelete = async (
    collection: EndPoint.TAGS | EndPoint.STATES,
    id: string
  ) => {
    deleteVal(collection, id);
  };

  const clusteringData = useMemo(() => {
    if (!tags || !gameTags) return;
    return getClusteringData(gameTags, tags);
  }, [gameTags, tags]);

  return (
    <FlexSection gutter={16} direction="column" className="p-16">
      <div>
        <Link to="/">
          <ArrowLeftOutlined /> Back to home
        </Link>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tags">
            <div className="flex flex-col gap-16">
              <div className="flex flex-wrap gap-16">
                {tags &&
                  Object.entries(tags).map(([name, value]) => (
                    <Tag key={name} $hue={value}>
                      {name} {value}
                      <CloseButton
                        onClick={() => handleDelete(EndPoint.TAGS, name)}
                      >
                        x
                      </CloseButton>
                    </Tag>
                  ))}
              </div>
              <Form
                onFinish={(values) => handleSubmit(EndPoint.TAGS, values)}
                layout="horizontal"
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Please input a name" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Hue" name="hue" className="flex-grow">
                  <InputTag />
                </Form.Item>
                <Button disabled={loading} loading={loading} htmlType="submit">
                  Add
                </Button>
              </Form>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="States">
            <div className="flex flex-col gap-16">
              <div className="flex flex-wrap gap-16">
                {states &&
                  Object.entries(states).map(([name, value]) => (
                    <Tag key={name} $hue={value}>
                      {name} {value}
                      <CloseButton
                        onClick={() => handleDelete(EndPoint.STATES, name)}
                      >
                        x
                      </CloseButton>
                    </Tag>
                  ))}
              </div>
              <Form
                onFinish={(values) => handleSubmit(EndPoint.STATES, values)}
                layout="horizontal"
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Please input a name" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Hue" name="hue" className="flex-grow">
                  <InputTag />
                </Form.Item>
                <Button disabled={loading} loading={loading} htmlType="submit">
                  Add
                </Button>
              </Form>
            </div>
          </Card>
        </Col>
        {clusteringData ? (
          <>
            <Col span={24}>
              <Card title="Circle Packing">
                <CirclePacking data={clusteringData.circlePackaging} />
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Hierarchical Edge Bundling">
                <HierarchicalEdgeBundling data={clusteringData.edgeBundling} />
              </Card>
            </Col>
          </>
        ) : (
          <Col span={24}>
            <Card title="Clustering">
              <Button disabled={loading} loading={loading} onClick={() => setGameTags(gameTagsData)}>
                Cluster
              </Button>
            </Card>
          </Col>
        )}
      </Row>
    </FlexSection>
  );
};

export default Settings;
