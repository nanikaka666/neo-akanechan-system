import { EntryClosedView } from "./EntryClosedView";
import { HeldView } from "./HeldView";
import { useCompetitionStatus } from "./hooks/useCompetitionStatus";

export function CompetitionView() {
  const status = useCompetitionStatus();
  return status.type === "notHeld" || status.type === "answerDecided" ? null : (
    <div id="competition-view-container">
      <div id="competition-view">
        {status.type === "held" ? (
          <HeldView status={status} />
        ) : (
          <EntryClosedView status={status} />
        )}
      </div>
    </div>
  );
}
