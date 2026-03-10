import { EntryClosedCompetition, HeldCompetition } from "../../../../types/competition";

interface CompetitionStatusViewProps {
  status: HeldCompetition | EntryClosedCompetition;
}

export function CompetitionStatusView({ status }: CompetitionStatusViewProps) {
  return (
    <div className="competition-status">
      <div className="question">
        <div className="header">問題</div>
        <div className="sentence">{status.settings.question}</div>
      </div>

      <div className="options">
        <div className="header">選択肢</div>
        <ul>
          {Array.from(status.statistics.options.keys()).map((label, index) => {
            const rate =
              status.statistics.all.betCount === 0
                ? 0
                : (
                    (status.statistics.options.get(label)!.betCount /
                      status.statistics.all.betCount) *
                    100
                  ).toFixed(2);
            return (
              <li key={label} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                <div className="option-label">
                  <div className="label">{label.toUpperCase()}</div>
                  <div className="option">{status.settings.options.get(label)}</div>
                </div>
                <div>{rate}%</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
