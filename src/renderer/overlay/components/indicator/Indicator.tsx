import { GaugeProps, Gauge } from "./Gauge";

type IndicatorProps = {
  label: string;
  currentValue: number;
} & GaugeProps;

export function Indicator({ label, currentValue, ...props }: IndicatorProps) {
  const levelClassName = `level-${props.gaugeLevel}`;
  return (
    <div className={`indicator ${levelClassName}`}>
      <Gauge {...props} />
      <div className="description">
        <div className="info font-m-plus-rounded">
          <div>{label}</div>
          <div className="value">{currentValue}</div>
        </div>
        <div className="next font-m-plus-rounded">
          <div>次の目標</div>
          <div>{props.range.max}</div>
        </div>
      </div>
    </div>
  );
}
