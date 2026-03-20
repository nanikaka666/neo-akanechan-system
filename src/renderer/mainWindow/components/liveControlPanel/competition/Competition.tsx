import { NotHeld } from "./NotHeld";
import { Held } from "./Held";
import { EntryClosed } from "./EntryClosed";
import { useCompetitionStatus } from "../../../../hooks/useCompetitionStatus";

export function Competition() {
  const status = useCompetitionStatus();

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
