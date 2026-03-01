import { HeldCompetition, OptionLabel } from "../../../../../types/competition";

export interface HeldProps {
  status: HeldCompetition;
}

export function Held({ status }: HeldProps) {
  return (
    <div key={status.settings.competitionId}>
      <div>問題: {status.settings.question}</div>
      <div>受付締切: {status.settings.scheduledClosedAt.toLocaleString()}</div>
      <div>
        <div>Bet Status</div>
        <div>参加人数: {status.statistics.all.betCount}</div>
        <div>Bet合計: {status.statistics.all.totalStakes}</div>
        <ul>
          {Array.from(status.statistics.options.keys()).map((label) => {
            const statistics = status.statistics.options.get(label)!;
            const percentage =
              status.statistics.all.betCount === 0
                ? 0
                : (statistics.betCount * 100) / status.statistics.all.betCount;
            return (
              <li key={label}>
                <div>
                  {label}: {status.settings.options.get(label)}
                </div>
                <div>
                  <div>
                    Bet人数: {statistics.betCount} ({percentage}%)
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
