import { useState } from "react";
import { OptionLabel } from "../../../../../types/competition";

export interface AnswerDecisionFormProps {
  options: Map<OptionLabel, string>;
}

export function AnswerDecisionForm({ options }: AnswerDecisionFormProps) {
  const [answer, setAnswer] = useState<OptionLabel>("a");
  const [disabled, setDisabled] = useState(false);

  return (
    <div>
      <select
        onChange={(e) => {
          e.preventDefault();
          setAnswer((_) => e.target.value as OptionLabel);
        }}
      >
        {Array.from(options.keys()).map((label) => {
          return (
            <option key={label} value={label}>
              {label}: {options.get(label)}
            </option>
          );
        })}
      </select>
      <button
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          setDisabled((_) => true);
          window.ipcApi.requestAnswerDecision(answer, options.get(answer)!).then(() => {
            setDisabled((_) => false);
          });
        }}
      >
        正解を確定する
      </button>
    </div>
  );
}
