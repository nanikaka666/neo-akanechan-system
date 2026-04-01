import { useCallback, useState } from "react";
import { OptionLabel } from "../../../../../types/competition";
import { useButton } from "../../../hooks/useButton";

type OptionNum = 2 | 3 | 4 | 5 | 6 | 7 | 8;

export function NotHeld() {
  const [question, setQuestion] = useState("");
  const [selectedOptionNum, setSelectedOptionNum] = useState<OptionNum>(2);
  const optionNumValues: OptionNum[] = [2, 3, 4, 5, 6, 7, 8];
  const [optionStrings, setOptionStrings] = useState<string[]>(["", "", "", "", "", "", "", ""]);
  const optionLabels = Array.from("abcdefgh") as OptionLabel[];
  const [betAcceptMinutes, setBetAcceptMinutes] = useState<number>(1);

  const betAcceptMinutesValues = [1, 5, 10, 15, 20, 30, 40, 50, 60, 90, 120, 150, 180];

  const [disabled, disable, enable] = useButton();

  const checkValidity = useCallback(() => {
    if (question === "") {
      return false;
    }
    const optionStringSet = new Set(optionStrings.slice(0, selectedOptionNum));
    if (optionStringSet.has("")) {
      return false;
    }
    return optionStringSet.size === selectedOptionNum;
  }, [question, selectedOptionNum, optionStrings]);

  return (
    <div className="not-held">
      <label>
        <h2>問題</h2>
        <input
          className="question"
          maxLength={50}
          type="text"
          value={question}
          onChange={(e) => {
            e.preventDefault();
            setQuestion((_) => e.target.value);
          }}
        />
      </label>
      <label>
        <h2>選択肢の数</h2>
        <select
          value={selectedOptionNum}
          onChange={(e) => {
            e.preventDefault();
            setSelectedOptionNum((_) => Number.parseInt(e.target.value) as OptionNum);
          }}
        >
          {optionNumValues.map((value) => {
            return (
              <option value={value} key={value}>
                {value}
              </option>
            );
          })}
        </select>
      </label>
      <div>
        <div>選択肢</div>
        <ul>
          {optionLabels.slice(0, selectedOptionNum).map((optionLabel, index) => {
            return (
              <li key={optionLabel}>
                <label>
                  {optionLabel.toUpperCase()}:{" "}
                  <input
                    type="text"
                    maxLength={20}
                    value={optionStrings[index]}
                    onChange={(e) => {
                      e.preventDefault();
                      setOptionStrings((prev) => {
                        const res = [...prev];
                        res[index] = e.target.value;
                        return res;
                      });
                    }}
                  />
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <label>
          <h2>Bet受付時間</h2>
          <select
            value={betAcceptMinutes}
            onChange={(e) => {
              e.preventDefault();
              setBetAcceptMinutes((_) => Number.parseInt(e.target.value));
            }}
          >
            {betAcceptMinutesValues.map((minutes) => {
              return (
                <option key={minutes} value={minutes}>
                  {minutes}分
                </option>
              );
            })}
          </select>
        </label>
      </div>
      <button
        className="action-button"
        disabled={!checkValidity() || disabled}
        onClick={(e) => {
          e.preventDefault();
          disable();
          window.ipcApi.mainWindow.competition
            .requestOpenCompetition(
              question,
              optionStrings.slice(0, selectedOptionNum),
              betAcceptMinutes,
            )
            .then((_) => {
              enable();
              setQuestion((_) => "");
              setOptionStrings((_) => ["", "", "", "", "", "", "", ""]);
            });
        }}
      >
        コンペを開始する
      </button>
    </div>
  );
}
