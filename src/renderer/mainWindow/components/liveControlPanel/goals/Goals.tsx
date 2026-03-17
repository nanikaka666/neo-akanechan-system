import { useLiveStatistics } from "../../../../hooks/useLiveStatistics";
import { LiveSettings } from "../../../../../types/liveSettings";
import { useAllGoalsStatus } from "../../hooks/useAllGoalsStatus";

export interface GoalsProps {
  liveSettings: LiveSettings;
}

export function Goals({ liveSettings }: GoalsProps) {
  const liveStatistics = useLiveStatistics();
  const allGoalsStatus = useAllGoalsStatus();

  return (
    <div>
      <div>目標と達成度</div>

      <div>
        <div>高評価数</div>
        <div>
          レベル:{" "}
          {allGoalsStatus.likeCountStatus.type === "accomplished"
            ? "達成！"
            : `${allGoalsStatus.likeCountStatus.currentLevel} / ${liveSettings.likeCountGoal.maxLevel}`}
        </div>
        <div>
          {liveStatistics.currentLikeCount} / {liveStatistics.maxLikeCount}
        </div>
        <div>
          <div>小目標</div>
          <ul>
            {liveSettings.likeCountGoal.goalValues.map((value, level) => {
              return level === 0 ? null : (
                <li key={level}>
                  レベル: {level}: {value}{" "}
                  {(allGoalsStatus.likeCountStatus.type === "accomplished" ||
                    level < allGoalsStatus.likeCountStatus.currentLevel) &&
                    "✅"}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div>
        <div>同接数</div>
        <div>
          レベル:{" "}
          {allGoalsStatus.viewerCountStatus.type === "accomplished"
            ? "達成！"
            : `${allGoalsStatus.viewerCountStatus.currentLevel} / ${liveSettings.viewerCountGoal.maxLevel}`}
        </div>
        <div>
          {liveStatistics.currentLiveViewCount} / {liveStatistics.maxLiveViewCount}
        </div>
        <div>
          <div>小目標</div>
          <ul>
            {liveSettings.viewerCountGoal.goalValues.map((value, level) => {
              return level === 0 ? null : (
                <li key={level}>
                  レベル: {level}: {value}{" "}
                  {(allGoalsStatus.viewerCountStatus.type === "accomplished" ||
                    level < allGoalsStatus.viewerCountStatus.currentLevel) &&
                    "✅"}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div>
        <div>チャンネル登録者数</div>
        <div>
          {liveStatistics.currentSubscriberCount} / {liveSettings.subscriberCountGoal}{" "}
          {allGoalsStatus.isSubscriberCountGoalAccomplished && "✅"}
        </div>
      </div>
    </div>
  );
}
