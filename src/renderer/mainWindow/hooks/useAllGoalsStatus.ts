import { useEffect, useState } from "react";
import { AllGoalsStatus } from "../../../types/goals";

export function useAllGoalsStatus() {
  const [allGoalStatus, setAllGoalStatus] = useState<AllGoalsStatus>({
    likeCountStatus: { type: "inProgress", currentLevel: 1 },
    viewerCountStatus: { type: "inProgress", currentLevel: 1 },
    isSubscriberCountGoalAccomplished: false,
  });

  useEffect(() => {
    const remover = window.ipcApi.mainWindow.registerAllGoalStatus((_, status) => {
      setAllGoalStatus((_) => status);
    });
    return () => remover();
  }, []);

  return allGoalStatus;
}
