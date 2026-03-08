import { useCallback, useState } from "react";
import { GoalsLevel, GoalsStatus } from "../../../../types/goals";
import { useLiveSettings } from "./useLiveSettings";

export function useLikeCountGoalStatus() {
  const liveSettings = useLiveSettings();
  const [likeCountGoalStatus, setLikeCountGoalStatus] = useState<GoalsStatus>({
    type: "inProgress",
    currentLevel: 1,
  });

  const likeCountPromotionFunc = useCallback(() => {
    // Note: it doesn't work when describe logic with "prev" variable.
    // likeCountPromotionFunc will be called multipe times at time (why?), so it causes unexpected over promotion.
    // Work arround: describe promoted level with "likeCountGoalStatus".
    setLikeCountGoalStatus(() => {
      if (likeCountGoalStatus.type === "inProgress") {
        if (likeCountGoalStatus.currentLevel === liveSettings.likeCountGoal.maxLevel) {
          return { type: "accomplished" };
        } else {
          return {
            ...likeCountGoalStatus,
            currentLevel: (likeCountGoalStatus.currentLevel + 1) as GoalsLevel,
          };
        }
      } else {
        return likeCountGoalStatus;
      }
    });
  }, [likeCountGoalStatus, liveSettings]);

  return [likeCountGoalStatus, likeCountPromotionFunc] as const;
}
