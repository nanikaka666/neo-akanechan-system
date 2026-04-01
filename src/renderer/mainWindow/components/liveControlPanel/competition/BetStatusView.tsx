import { EntryClosedCompetition, HeldCompetition } from "../../../../../types/competition";

interface BetStatusViewProps {
  status: HeldCompetition | EntryClosedCompetition;
}

export function BetStatusView({ status }: BetStatusViewProps) {
  return (
    <div className="bet-status">
      <h2>Bet Status</h2>
      <div>
        <h3>参加人数</h3>
        <div>{status.statistics.all.betCount}</div>
      </div>
      <div>
        <h3>Bet合計</h3>
        <div>{status.statistics.all.totalStakes}</div>
      </div>
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
                  Bet人数: {statistics.betCount} ({percentage.toFixed(2)}%)
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
