import { useCallback, useState } from "react";
import { GoalsLevel, GoalsStatus } from "../../../../types/goals";
import { useLiveSettings } from "./useLiveSettings";

export function useViewerCountGoalStatus() {
  const liveSettings = useLiveSettings();
  const [viewerCountGoalStatus, setViewerCountGoalStatus] = useState<GoalsStatus>({
    type: "inProgress",
    currentLevel: 1,
  });

  const viewerCountPromotionFunc = useCallback(() => {
    // Note: it doesn't work when describe logic with "prev" variable.
    // viewerCountPromotionFunc will be called multipe times at time (why?), so it causes unexpected over promotion.
    // Work arround: describe promoted level with "viewerCountGoalStatus".
    setViewerCountGoalStatus(() => {
      if (viewerCountGoalStatus.type === "inProgress") {
        if (viewerCountGoalStatus.currentLevel === liveSettings.viewerCountGoal.maxLevel) {
          return { type: "accomplished" };
        } else {
          return {
            ...viewerCountGoalStatus,
            currentLevel: (viewerCountGoalStatus.currentLevel + 1) as GoalsLevel,
          };
        }
      } else {
        return viewerCountGoalStatus;
      }
    });
  }, [viewerCountGoalStatus, liveSettings]);

  return [viewerCountGoalStatus, viewerCountPromotionFunc] as const;
}
