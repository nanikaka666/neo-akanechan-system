import { HeldCompetition } from "../../../../types/competition";

import { CompetitionStatusView } from "./CompetitionStatusView";

interface HeldViewProps {
  status: HeldCompetition;
}

export function HeldView({ status }: HeldViewProps) {
  return (
    <div className="held">
      <div className="title">コンペティション参加受付中</div>
      <CompetitionStatusView status={status} />
    </div>
  );
}
