import { useEffect, useState } from "react";
import { NotHeld } from "./NotHeld";
import { CompetitionStatus } from "../../../../../types/competition";

export function Competition() {
  const [status, setStatus] = useState<CompetitionStatus>({ type: "notHeld" });

  useEffect(() => {
    const remover = window.ipcApi.registerCompetitionStatusListener((_, newStatus) => {
      setStatus((_) => newStatus);
    });
    return () => remover();
  }, []);
  return status.type === "notHeld" ? (
    <NotHeld />
  ) : status.type === "held" ? (
    <div>Held</div>
  ) : (
    <div>Entry Closed</div>
  );
}
