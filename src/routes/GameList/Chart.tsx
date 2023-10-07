import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useState } from "react";
import {
  eachYearOfInterval,
  endOfMonth,
  endOfYear,
  getYear,
  startOfYear,
  subYears,
} from "date-fns";
import Spin from "@/components/ui/Spin";
import React from "react";
import { Col, Row } from "antd";
import styled from "styled-components";
import { dateToNumber } from "@/utils/format";
import { RangePicker } from "@/components/ui/DatePicker";
import { RangeValue } from "rc-picker/lib/interface";
import { AggregateI, EndPoint, GenericObject } from "@/ts";
import { useFetch } from "@/hooks/useFetch";
import { HoursChart } from "./Charts/HoursChart";
import { StatesChart } from "./Charts/StatesChart";
import { TagsChart } from "./Charts/TagsChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MIN_DATE = new Date(2015, 0, 1);
const MAX_DATE = endOfMonth(new Date());
const MIN_DATE_NUMBER = dateToNumber(MIN_DATE);
const MAX_DATE_NUMBER = dateToNumber(MAX_DATE);

//disable future dates in datepicker
//disable dates before 2015
//disable wrong dates (end date before start date)
const disabledDate = (current: number) => {
  return current > MAX_DATE_NUMBER || current < MIN_DATE_NUMBER;
};

const rangePresets: {
  label: string;
  value: [number, number];
}[] = [
  {
    label: "All",
    value: [MIN_DATE_NUMBER, MAX_DATE_NUMBER],
  },
  {
    label: "Last Year",
    value: [dateToNumber(subYears(MAX_DATE, 1)), MAX_DATE_NUMBER],
  },
  ...eachYearOfInterval({
    start: MIN_DATE,
    end: MAX_DATE,
  })
    .map((year) => ({
      label: getYear(year).toString(),
      value: [
        dateToNumber(startOfYear(year)),
        dateToNumber(endOfYear(year)),
      ] as [number, number],
    }))
    .reverse(),
];

const defaultPickerValue: [number, number] = [
  dateToNumber(subYears(MAX_DATE, 1)),
  MAX_DATE_NUMBER,
];

const defaultRangeFilter: GenericObject = {
  startDate: defaultPickerValue[0],
  endDate: defaultPickerValue[1],
};

const ChartContainer = styled.div`
  .ant-col.chart {
    &.line {
      height: 30vh;
    }
    &.game,
    &.tag {
      height: 50vh;
    }
    .ant-card {
      height: 100%;

      .ant-card-body {
        height: 100%;
        width: 100%;
      }
    }
  }
`;

export const ChartComponent: React.FC = () => {
  const [rangeFilterValue, setRangeFilterValue] =
    useState<GenericObject>(defaultRangeFilter);
  const { data, loading } = useFetch<AggregateI>(
    EndPoint.AGGREGATES,
    rangeFilterValue
  );

  const handleRangeChange = (value: RangeValue<number>) => {
    if (!value) return;
    setRangeFilterValue({
      startDate: value[0],
      endDate: value[1],
    });
  };

  return (
    <Spin spinning={loading} size="large">
      <ChartContainer>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <RangePicker
              picker="month"
              disabledDate={disabledDate}
              presets={rangePresets}
              defaultValue={defaultPickerValue}
              onChange={handleRangeChange}
            />
          </Col>
          <Col span={24} className="line chart">
            <HoursChart data={data?.playedTime} />
          </Col>
          <Col xs={24} lg={12} className="game chart">
            <StatesChart data={data?.states} />
          </Col>
          <Col xs={24} lg={12} className="tag chart">
            <TagsChart data={data?.tags} />
          </Col>
        </Row>
      </ChartContainer>
    </Spin>
  );
};
