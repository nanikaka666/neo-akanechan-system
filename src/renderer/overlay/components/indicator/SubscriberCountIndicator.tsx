import { Indicator } from "./Indicator";

export interface SubscriberCountIndicatorProps {
  goalValue: number;
  currentValue: number;
  maxValueSoFar: number;
}

export function SubscriberCountIndicator({
  goalValue,
  currentValue,
  maxValueSoFar,
}: SubscriberCountIndicatorProps) {
  return (
    <Indicator
      label="チャンネル登録者数"
      gaugeLevel={5}
      currentValue={currentValue}
      value={maxValueSoFar}
      range={{ min: 0, max: goalValue }}
    />
  );
}
