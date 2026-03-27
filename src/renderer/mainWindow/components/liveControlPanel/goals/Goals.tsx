import { useLiveStatistics } from "../../../../hooks/useLiveStatistics";
import { LiveSettings } from "../../../../../types/liveSettings";
import { useAllGoalsStatus } from "../../../hooks/useAllGoalsStatus";

interface GoalsProps {
  liveSettings: LiveSettings;
}

export function Goals({ liveSettings }: GoalsProps) {
  const liveStatistics = useLiveStatistics();
  const allGoalsStatus = useAllGoalsStatus();

  return (
    <div className="goals">
      <div
        className={[
          "goal",
          allGoalsStatus.likeCountStatus.type === "accomplished" ? "accomplished" : "",
        ].join(" ")}
      >
        <h2>高評価数</h2>
        <div>
          {liveStatistics.currentLikeCount} / {liveStatistics.maxLikeCount}
        </div>
        <div>
          <h3>小目標</h3>
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

      <div
        className={[
          "goal",
          allGoalsStatus.viewerCountStatus.type === "accomplished" ? "accomplished" : "",
        ].join(" ")}
      >
        <h2>同接数</h2>
        <div>
          {liveStatistics.currentLiveViewCount} / {liveStatistics.maxLiveViewCount}
        </div>
        <div>
          <h3>小目標</h3>
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

      <div
        className={[
          "goal",
          allGoalsStatus.isSubscriberCountGoalAccomplished ? "accomplished" : "",
        ].join(" ")}
      >
        <h2>チャンネル登録者数</h2>
        <div>
          {liveStatistics.currentSubscriberCount} / {liveSettings.subscriberCountGoal}{" "}
          {allGoalsStatus.isSubscriberCountGoalAccomplished && "✅"}
        </div>
      </div>
    </div>
  );
}
