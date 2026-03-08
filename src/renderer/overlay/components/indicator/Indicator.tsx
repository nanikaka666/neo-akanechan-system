import { GaugeProps, Gauge } from "./Gauge";
import { IndicatorDescription } from "./IndicatorDescription";

type IndicatorProps = {
  label: string;
  currentValue: number;
} & GaugeProps;

export function Indicator({ label, currentValue, ...props }: IndicatorProps) {
  const levelClassName = `level-${props.gaugeLevel}`;
  return (
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
