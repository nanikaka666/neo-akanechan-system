import { useCompetitionStatus } from "../../../hooks/useCompetitionStatus";
import { EntryClosedView } from "./EntryClosedView";
import { HeldView } from "./HeldView";
import { HowToJoin } from "./HowToJoin";

export function CompetitionView() {
  const status = useCompetitionStatus();
  return status.type === "notHeld" || status.type === "answerDecided" ? null : (
    <div className="competition-view-container">
      <div className="competition-view">
        {status.type === "held" ? (
          <>
            <HowToJoin closedAt={status.settings.scheduledClosedAt} />
            <HeldView status={status} />
          </>
        ) : (
          <EntryClosedView status={status} />
        )}
      </div>
    </div>
  );
}
