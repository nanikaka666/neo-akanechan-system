import { useEffect, useState } from "react";
import { NotHeld } from "./NotHeld";
import { CompetitionStatus } from "../../../../../types/competition";
import { Held } from "./Held";
import { EntryClosed } from "./EntryClosed";

export function Competition() {
  const [status, setStatus] = useState<CompetitionStatus>({ type: "notHeld" });

  useEffect(() => {
    const remover = window.ipcApi.common.registerCompetitionStatusListener((_, newStatus) => {
      setStatus((_) => newStatus);
    });
    return () => remover();
  }, []);
  return status.type === "notHeld" ? (
    <NotHeld />
  ) : status.type === "held" ? (
    <Held status={status} />
  ) : status.type === "entryClosed" ? (
    <EntryClosed status={status} />
  ) : (
    <div>Answer Decided</div>
  );
}
