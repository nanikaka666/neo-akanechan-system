import { Goal } from "../../../../types/liveSettings";
import { GaugeLevel } from "./Gauge";
import { Indicator } from "./Indicator";

interface ViewerCountIndicatorProps {
  gaugeLevel: GaugeLevel;
  goal: Goal;
  currentValue: number;
  maxValueSoFar: number;
  isAccomplished: boolean;
}

export function ViewerCountIndicator({
  gaugeLevel,
  goal,
  currentValue,
  maxValueSoFar,
  isAccomplished,
}: ViewerCountIndicatorProps) {
  return (
    <Indicator
      label="同接数"
      gaugeLevel={gaugeLevel}
      currentValue={currentValue}
      isAccomplished={isAccomplished}
      value={maxValueSoFar}
      range={{ min: goal.goalValues[gaugeLevel - 1], max: goal.goalValues[gaugeLevel] }}
    />
  );
}
