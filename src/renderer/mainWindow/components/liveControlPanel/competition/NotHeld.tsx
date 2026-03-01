import { useCallback, useState } from "react";
import { OptionLabel } from "../../../../../types/competition";

type OptionNum = 2 | 3 | 4 | 5 | 6 | 7 | 8;

export function NotHeld() {
  const [question, setQuestion] = useState("");
  const [selectedOptionNum, setSelectedOptionNum] = useState<OptionNum>(2);
  const optionNumValues: OptionNum[] = [2, 3, 4, 5, 6, 7, 8];
  const [optionStrings, setOptionStrings] = useState<string[]>(["", "", "", "", "", "", "", ""]);
  const optionLabels = Array.from("abcdefgh") as OptionLabel[];
  const [betAcceptMinutes, setBetAcceptMinutes] = useState<number>(1);

  const betAcceptMinutesValues = [1, 5, 10, 15, 20, 30, 40, 50, 60, 90, 120, 150, 180];

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const checkValidity = useCallback(() => {
    if (question === "") {
      return false;
    }
    if (optionStrings.slice(0, selectedOptionNum).filter((option) => option === "").length > 0) {
      return false;
    }
    return true;
  }, [question, selectedOptionNum, optionStrings]);

  return (
    <div>
      <label>
        問題
        <input
          maxLength={100}
          type="text"
          value={question}
          onChange={(e) => {
            e.preventDefault();
            setQuestion((_) => e.target.value);
          }}
        />
      </label>
      <label>
        選択肢の数
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
          Bet受付時間
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
        disabled={!checkValidity() || buttonDisabled}
        onClick={(e) => {
          e.preventDefault();
          setButtonDisabled((_) => true);
          window.ipcApi
            .requestOpenCompetition(
              question,
              optionStrings.slice(0, selectedOptionNum),
              betAcceptMinutes,
            )
            .then((_) => {
              setButtonDisabled((_) => false);
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
