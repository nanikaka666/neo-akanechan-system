import { Indicator } from "./Indicator";

interface SubscriberCountIndicatorProps {
  goalValue: number;
  currentValue: number;
  maxValueSoFar: number;
  isAccomplished: boolean;
}

export function SubscriberCountIndicator({
  goalValue,
  currentValue,
  maxValueSoFar,
  isAccomplished,
}: SubscriberCountIndicatorProps) {
  return (
    <Indicator
      label="CH登録者数"
      gaugeLevel={5}
      currentValue={currentValue}
      isAccomplished={isAccomplished}
      value={maxValueSoFar}
      range={{ min: 0, max: goalValue }}
    />
  );
}
