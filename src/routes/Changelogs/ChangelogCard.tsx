import { Button, Card, Col, List, Row, Space, Tooltip } from "antd";
import { useState } from "react";
import { Statistic } from "@/components/ui/Statistics";
import { formatPlayedTime, formattedDate } from "@/utils/format";
import {
  DeleteFilled,
  EditFilled,
  SaveFilled,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { numberToDate } from "@/utils/format";
import ChangelogForm from "./ChangelogForm";
import { GameChangelogI } from "@/ts";
import Img from "@/components/ui/Img";
import Icon from "@mdi/react";
import { mdiMerge, mdiSeal } from "@mdi/js";

interface ChangelogCardI {
  gameChangelog: GameChangelogI;
  onFinish: (values: any, id?: string) => void;
  onDelete: (id: string) => void;
}

const ChangelogCard = (props: ChangelogCardI) => {
  const [isEdit, setIsEdit] = useState(false);

  function handleFinish(values: any) {
    props.onFinish(values, props.gameChangelog.id);
    setIsEdit(!isEdit);
  }

  return (
    <List
      key={props.gameChangelog.id}
      size="small"
      header={
        <div className="flex items-center justify-between gap-16">
          <Img
            height={75}
            src={props.gameChangelog.imageUrl || ""}
            alt={`${props.gameChangelog.name} header`}
            $errorComponent={
              <span className="font-16">{props.gameChangelog.name}</span>
            }
          />
          <h2>{props.gameChangelog.name}</h2>
        </div>
      }
      bordered
      dataSource={props.gameChangelog.changeLogs.map((changeLog) => (
        <div
          key={changeLog.id}
          className="w-full flex justify-between items-center gap-16"
        >
          <div className="flex gap-16">
            <span>{formattedDate(numberToDate(changeLog.createdAt))}</span>
            <span className="flex items-center gap-4">
              <span>{changeLog.achievements}</span>
              <Icon path={mdiSeal} size="16px" />
            </span>
            <span>{changeLog.stateId}</span>
            <span>{formatPlayedTime(changeLog.hours)}</span>
          </div>
          <Space.Compact>
            <Button
              type="text"
              icon={<VerticalAlignTopOutlined />}
              onClick={() => setIsEdit(!isEdit)}
            />
            <Button
              type="text"
              icon={<VerticalAlignBottomOutlined />}
              onClick={() => setIsEdit(!isEdit)}
            />
            <Button
              type="text"
              icon={<EditFilled />}
              onClick={() => setIsEdit(!isEdit)}
            />
            <Button
              type="text"
              danger
              icon={<DeleteFilled />}
              onClick={() => setIsEdit(!isEdit)}
            />
          </Space.Compact>
        </div>
      ))}
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
  );
};

export default ChangelogCard;
