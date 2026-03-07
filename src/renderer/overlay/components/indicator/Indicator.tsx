import { GaugeProps, Gauge } from "./Gauge";

export type IndicatorProps = {
  label: string;
  currentValue: number;
} & GaugeProps;

export function Indicator({ label, ...props }: IndicatorProps) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          backgroundColor: "rgb(0, 0, 0, 0.2)",
          padding: 10,
          width: "fit-content",
        }}
      >
        <div className="font-m-plus-rounded indicator-label">{label}</div>
        <div className="font-m-plus-rounded indicator-label">{props.currentValue}</div>
        <div className="font-m-plus-rounded indicator-label">
          ({props.value}/{props.range.max})
        </div>
      </div>
      <Gauge {...props} />
    </div>
  );
}
