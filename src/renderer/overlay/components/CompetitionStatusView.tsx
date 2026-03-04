import { EntryClosedCompetition, HeldCompetition } from "../../../types/competition";

interface CompetitionStatusViewProps {
  status: HeldCompetition | EntryClosedCompetition;
}

export function CompetitionStatusView({ status }: CompetitionStatusViewProps) {
  return (
    <div>
      <div>{status.settings.question}</div>

      <ul>
        {Array.from(status.statistics.options.keys()).map((label) => {
          const rate =
            status.statistics.all.betCount === 0
              ? 0
              : (
                  (status.statistics.options.get(label)!.betCount /
                    status.statistics.all.betCount) *
                  100
                ).toFixed(2);
          return (
            <li key={label}>
              {label.toUpperCase()}: {status.settings.options.get(label)} ({rate}%)
            </li>
          );
        })}
      </ul>
    </div>
  );
}
