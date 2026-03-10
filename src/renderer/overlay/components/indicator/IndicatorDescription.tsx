interface IndicatorDescriptionProps {
  label: string;
  currentValue: number;
  nextGoalValue?: number;
}

export function IndicatorDescription({
  label,
  currentValue,
  nextGoalValue,
}: IndicatorDescriptionProps) {
  return (
    <div className="indicator-description">
      <div className="info font-m-plus-rounded">
        <div>{label}</div>
        <div className="value">{currentValue}</div>
      </div>
      {nextGoalValue && (
        <div className="next font-m-plus-rounded">
          <div>次の目標</div>
          <div>{nextGoalValue}</div>
        </div>
      )}
    </div>
  );
}
