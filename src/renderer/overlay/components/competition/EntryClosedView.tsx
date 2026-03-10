import { EntryClosedCompetition } from "../../../../types/competition";
import { CompetitionStatusView } from "./CompetitionStatusView";

interface EntryClosedViewProps {
  status: EntryClosedCompetition;
}

export function EntryClosedView({ status }: EntryClosedViewProps) {
  return (
    <div className="entry-closed">
      <CompetitionStatusView status={status} />
    </div>
  );
}
