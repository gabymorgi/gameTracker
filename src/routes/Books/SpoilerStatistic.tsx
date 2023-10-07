import { Statistic } from "antd";
import { useState } from "react";

interface SpoilerStatisticProps {
  title: string;
  value: string;
}

function SpoilerStatistic(props: SpoilerStatisticProps) {
  const [isLoading, setIsLoading] = useState(!!props.value);
  return (
    <div
      onClick={() => setIsLoading(!isLoading)}
    >
      <Statistic
        title={props.title}
        value={props.value || "-"}
        loading={isLoading}
      />
    </div>
  );
}

export default SpoilerStatistic;
