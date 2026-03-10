import { Goal } from "../../../../types/liveSettings";
import { GaugeLevel } from "./Gauge";
import { Indicator } from "./Indicator";

interface LikeCountIndicatorProps {
  gaugeLevel: GaugeLevel;
  goal: Goal;
  currentValue: number;
  maxValueSoFar: number;
  isAccomplished: boolean;
}

export function LikeCountIndicator({
  gaugeLevel,
  goal,
  currentValue,
  maxValueSoFar,
  isAccomplished,
}: LikeCountIndicatorProps) {
  return (
    <Indicator
      label="高評価数"
      gaugeLevel={gaugeLevel}
      currentValue={currentValue}
      isAccomplished={isAccomplished}
      value={maxValueSoFar}
      range={{ min: goal.goalValues[gaugeLevel - 1], max: goal.goalValues[gaugeLevel] }}
    />
  );
}
