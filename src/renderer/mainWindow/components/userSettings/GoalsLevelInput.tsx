import { useState } from "react";

export function GoalsLevelInput({
  initialValue,
  func,
}: {
  initialValue: 1 | 2 | 3 | 4 | 5;
  func: (value: 1 | 2 | 3 | 4 | 5) => void;
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
                const input = Number.parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5;
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
