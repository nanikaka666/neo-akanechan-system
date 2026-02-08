import { GaugeLevel } from "./Gauge";
import { Indicator } from "./Indicator";

export interface SubscriberCountIndicatorProps {
  gaugeLevel: GaugeLevel;
}

export function SubscriberCountIndicator({ gaugeLevel }: SubscriberCountIndicatorProps) {
  return (
    <Indicator
      label="チャンネル登録者数"
      gaugeLevel={gaugeLevel}
      currentValue={8}
      value={10}
      range={{ min: 0, max: 100 }}
    />
  );
}
