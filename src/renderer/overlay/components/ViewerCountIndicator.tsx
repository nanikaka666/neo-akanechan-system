import { GaugeLevel } from "./Gauge";
import { Indicator } from "./Indicator";

export interface ViewerCountIndicatorProps {
  gaugeLevel: GaugeLevel;
}

export function ViewerCountIndicator({ gaugeLevel }: ViewerCountIndicatorProps) {
  return (
    <Indicator
      label="同接数"
      gaugeLevel={gaugeLevel}
      currentValue={100}
      value={200}
      range={{ min: 0, max: 10000 }}
    />
  );
}
