import { useEffect, useState } from "react";
import { PariticipantPointRankings } from "../../../types/participantPoint";
import { useIsShownRanking } from "./useIsShownRanking";

export function useRankings() {
  const [rankings, setRankings] = useState<PariticipantPointRankings>();
  const [reflectRankingsToOverlayEnabled, setReflectRankingsToOverlayEnabled] = useState(false);
  const isRankingsShownOnOverlay = useIsShownRanking();

  useEffect(() => {
    const remover = window.ipcApi.mainWindow.registerRankingsListener((e, rankings) => {
      setRankings((_) => rankings);
      setReflectRankingsToOverlayEnabled((_) => true);
    });
    return () => remover();
  }, []);

  const onClickReflectRankingButton = (rankings: PariticipantPointRankings) => {
    setReflectRankingsToOverlayEnabled((_) => false);
    window.ipcApi.mainWindow.requestShowRanking(rankings);
  };

  const onClickHideRankingButton = () => {
    setReflectRankingsToOverlayEnabled((_) => true);
    window.ipcApi.mainWindow.requestHideRanking();
  };

  return [
    rankings,
    reflectRankingsToOverlayEnabled,
    isRankingsShownOnOverlay,
    onClickReflectRankingButton,
    onClickHideRankingButton,
  ] as const;
}
