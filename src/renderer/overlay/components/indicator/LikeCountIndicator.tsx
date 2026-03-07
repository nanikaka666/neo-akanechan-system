import { Goal } from "../../../../types/liveSettings";
import { GaugeLevel } from "./Gauge";
import { Indicator } from "./Indicator";

export interface LikeCountIndicatorProps {
  gaugeLevel: GaugeLevel;
  goal: Goal;
  currentValue: number;
  maxValueSoFar: number;
}

export function LikeCountIndicator({
  gaugeLevel,
  goal,
  currentValue,
  maxValueSoFar,
}: LikeCountIndicatorProps) {
  return (
    <Indicator
      label="高評価数"
      gaugeLevel={gaugeLevel}
      currentValue={currentValue}
      value={maxValueSoFar}
      range={{ min: goal.goalValues[gaugeLevel - 1], max: goal.goalValues[gaugeLevel] }}
    />
  );
}
