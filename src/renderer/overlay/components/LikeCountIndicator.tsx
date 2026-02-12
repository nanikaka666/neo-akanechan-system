import { Goal } from "../../../types/liveSettings";
import { GaugeLevel } from "./Gauge";
import { Indicator } from "./Indicator";

export interface LikeCountIndicatorProps {
  gaugeLevel: GaugeLevel;
  goal: Goal;
}

export function LikeCountIndicator({ gaugeLevel, goal }: LikeCountIndicatorProps) {
  return (
    <Indicator
      label="高評価数"
      gaugeLevel={gaugeLevel}
      currentValue={8}
      value={10}
      range={{ min: goal.goalValues[gaugeLevel - 1], max: goal.goalValues[gaugeLevel] }}
    />
  );
}
