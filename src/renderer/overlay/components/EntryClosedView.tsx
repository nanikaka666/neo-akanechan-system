import { EntryClosedCompetition } from "../../../types/competition";
import { CompetitionStatusView } from "./CompetitionStatusView";

interface EntryClosedViewProps {
  status: EntryClosedCompetition;
}

export function EntryClosedView({ status }: EntryClosedViewProps) {
  return (
    <div>
      <CompetitionStatusView status={status} />
      <div>参加を締め切りました。</div>
    </div>
  );
}
