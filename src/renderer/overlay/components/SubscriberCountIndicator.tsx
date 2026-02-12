import { Indicator } from "./Indicator";

export interface SubscriberCountIndicatorProps {
  goalValue: number;
}

export function SubscriberCountIndicator({ goalValue }: SubscriberCountIndicatorProps) {
  return (
    <Indicator
      label="チャンネル登録者数"
      gaugeLevel={5}
      currentValue={8}
      value={10}
      range={{ min: 0, max: goalValue }}
    />
  );
}
