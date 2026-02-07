import { GaugeLevel } from "./Gauge";
import { Indicator } from "./Indicator";

export interface LikeCountIndicatorProps {
  gaugeLevel: GaugeLevel;
}

export function LikeCountIndicator({ gaugeLevel }: LikeCountIndicatorProps) {
  return (
    <Indicator
      label="高評価数"
      gaugeLevel={gaugeLevel}
      currentValue={8}
      value={10}
      range={{ min: 0, max: 100 }}
    />
  );
}
