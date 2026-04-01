import { useState } from "react";
import { OptionLabel } from "../../../../../types/competition";
import { useButton } from "../../../hooks/useButton";

interface AnswerDecisionFormProps {
  options: Map<OptionLabel, string>;
}

export function AnswerDecisionForm({ options }: AnswerDecisionFormProps) {
  const [answer, setAnswer] = useState<OptionLabel>("a");
  const [disabled, disable, enable] = useButton();

  return (
    <div className="answer-decision">
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
        className="action-button"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          disable();
          window.ipcApi.mainWindow.competition
            .requestAnswerDecision(answer, options.get(answer)!)
            .then(() => {
              enable();
            });
        }}
      >
        正解を確定する
      </button>
    </div>
  );
}
