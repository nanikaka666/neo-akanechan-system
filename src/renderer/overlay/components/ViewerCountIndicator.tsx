import { Goal } from "../../../types/liveSettings";
import { GaugeLevel } from "./Gauge";
import { Indicator } from "./Indicator";

export interface ViewerCountIndicatorProps {
  gaugeLevel: GaugeLevel;
  goal: Goal;
}

export function ViewerCountIndicator({ gaugeLevel, goal }: ViewerCountIndicatorProps) {
  return (
    <Indicator
      label="同接数"
      gaugeLevel={gaugeLevel}
      currentValue={100}
      value={200}
      range={{ min: goal.goalValues[gaugeLevel - 1], max: goal.goalValues[gaugeLevel] }}
    />
  );
}
