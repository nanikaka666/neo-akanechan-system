import { Goal } from "../../../../types/liveSettings";

interface GoalsHavingLevelsProps {
  goal: Goal;
}

export function GoalsHavingLevels({ goal }: GoalsHavingLevelsProps) {
  return (
    <div>
      <div>最終目標値: {goal.goalValues.slice(-1)}</div>
      <div>小目標</div>
      <ul>
        {goal.goalValues.map((goalValue, idx) => {
          return idx === 0 ? null : (
            <li key={idx}>
              Level {idx}: {goalValue}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
