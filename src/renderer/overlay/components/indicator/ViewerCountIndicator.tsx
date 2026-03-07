import { Goal } from "../../../../types/liveSettings";
import { GaugeLevel } from "./Gauge";
import { Indicator } from "./Indicator";

export interface ViewerCountIndicatorProps {
  gaugeLevel: GaugeLevel;
  goal: Goal;
  currentValue: number;
  maxValueSoFar: number;
}

export function ViewerCountIndicator({
  gaugeLevel,
  goal,
  currentValue,
  maxValueSoFar,
}: ViewerCountIndicatorProps) {
  return (
    <Indicator
      label="同接数"
      gaugeLevel={gaugeLevel}
      currentValue={currentValue}
      value={maxValueSoFar}
      range={{ min: goal.goalValues[gaugeLevel - 1], max: goal.goalValues[gaugeLevel] }}
    />
  );
}
