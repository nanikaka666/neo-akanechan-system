import { useEffect, useState } from "react";

export function useIsShownRanking() {
  const [isShown, setIsShown] = useState(false);
  useEffect(() => {
    const remover = window.ipcApi.mainWindow.ranking.registerIsShownRankingListener(
      (_, nextIsShown) => {
        setIsShown((_) => nextIsShown);
      },
    );
    return () => remover();
  }, []);

  return isShown;
}
