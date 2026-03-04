import { useEffect, useState } from "react";
import { CompetitionStatus } from "../../../../types/competition";

export function useCompetitionStatus() {
  const [status, setStatus] = useState<CompetitionStatus>({ type: "notHeld" });
  useEffect(() => {
    const remover = window.ipcApi.registerCompetitionStatusListener((_, nextStatus) => {
      setStatus((_) => nextStatus);
    });
    return () => remover();
  }, []);

  return status;
}
