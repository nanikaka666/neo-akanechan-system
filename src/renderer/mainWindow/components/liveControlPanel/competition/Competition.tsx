import { useEffect, useState } from "react";
import { NotHeld } from "./NotHeld";
import { CompetitionStatus } from "../../../../../types/competition";
import { Held } from "./Held";

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
    <Held status={status} />
  ) : (
    <div>Entry Closed</div>
  );
}
