import { GaugeProps, Gauge } from "./Gauge";
import { IndicatorDescription } from "./IndicatorDescription";

type IndicatorProps = {
  label: string;
  currentValue: number;
  isAccomplished: boolean;
} & GaugeProps;

export function Indicator({ label, currentValue, isAccomplished, ...props }: IndicatorProps) {
  const levelClassName = `level-${props.gaugeLevel}`;
  return isAccomplished ? (
    <IndicatorDescription label={label} currentValue={currentValue} />
  ) : (
    <div className={`indicator ${levelClassName}`}>
      <Gauge {...props} />
      <IndicatorDescription
        label={label}
        currentValue={currentValue}
        nextGoalValue={props.range.max}
      />
    </div>
  );
}
