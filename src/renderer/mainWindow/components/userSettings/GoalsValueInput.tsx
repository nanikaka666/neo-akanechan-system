import { useState } from "react";

interface GoalsValueInputProps {
  initialValue: number;
  func: (value: number) => void;
}

export function GoalsValueInput({ initialValue, func }: GoalsValueInputProps) {
  const [input, setInput] = useState(initialValue.toString());
  return (
    <input
      type="text"
      onChange={(e) => {
        setInput((_) => e.target.value);
        const maybeNumber = Number.parseInt(e.target.value);
        if (!Number.isNaN(maybeNumber)) {
          func(maybeNumber);
        }
      }}
      value={input}
    />
  );
}
