import { Line } from "react-chartjs-2";
import { useMemo } from "react";
import React from "react";
import { Card } from "antd";
import { NoData } from "./NoData";
import { format, parse } from "date-fns";

const HoursPlayedOptions = {
  maintainAspectRatio: false,
  color: "#FFF",
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: `Hours Played`,
      color: "#EEE",
      font: {
        size: 24,
      },
    },
  },
  scales: {
    y: {
      ticks: {
        color: "#EEE",
        font: {
          size: 14,
        },
      },
      grid: {
        color: "#444",
      },
    },
    x: {
      ticks: {
        color: "#EEE",
        font: {
          size: 14,
        },
      },
      grid: {
        color: "#444",
      },
    },
  },
};

interface Props {
  data?: Array<{
    month_year: string;
    achievements: number;
    hours: number;
  }>;
}

export const HoursChart: React.FC<Props> = (props) => {
  const dataChart = useMemo(() => {
    const labels = props.data?.map((d) => format(parse(d.month_year, "yyyy-MM", new Date()), "MMM yy"));
    const values = props.data?.map((d) => d.hours / 60);
    const total = props.data?.reduce((acc, curr) => acc + curr.achievements, 0);
    return {
      labels,
      values,
      total,
    };
  }, [props.data]);

  return (
    <Card>
      {props.data?.length ? (
        <Line
          datasetIdKey="id"
          data={{
            labels: dataChart.labels,
            datasets: [
              {
                data: dataChart.values,
                fill: true,
                borderColor: "#8F8",
                cubicInterpolationMode: "monotone",
              },
            ],
          }}
          options={HoursPlayedOptions}
        />
      ) : (
        <NoData />
      )}
    </Card>
  );
};
