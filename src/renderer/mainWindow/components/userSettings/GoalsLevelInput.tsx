import { useState } from "react";
import { GoalsLevel } from "../../../../types/goals";

export function GoalsLevelInput({
  initialValue,
  func,
}: {
  initialValue: GoalsLevel;
  func: (value: GoalsLevel) => void;
}) {
  const [selected, setSelected] = useState(initialValue);

  return (
    <div>
      {[1, 2, 3, 4, 5].map((level) => {
        return (
          <label key={level}>
            <input
              type="radio"
              value={level}
              checked={selected === level}
              onChange={(e) => {
                const input = Number.parseInt(e.target.value) as GoalsLevel;
                setSelected((_) => input);
                func(input);
              }}
            />
            {level}
          </label>
        );
      })}
    </div>
  );
}
