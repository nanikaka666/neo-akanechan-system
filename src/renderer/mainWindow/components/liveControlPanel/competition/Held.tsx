import { HeldCompetition } from "../../../../../types/competition";
import { AbortButton } from "./AbortButton";
import { BetStatusView } from "./BetStatusView";
import { ManuallyEntryCloseButton } from "./ManuallyEntryCloseButton";

interface HeldProps {
  status: HeldCompetition;
}

export function Held({ status }: HeldProps) {
  return (
    <div className="held" key={status.settings.competitionId}>
      <div>
        <h2>問題</h2>
        <div>{status.settings.question}</div>
      </div>
      <div>
        <h2>受付締切</h2>
        <div>{status.settings.scheduledClosedAt.toLocaleString()}</div>
      </div>
      <BetStatusView status={status} />
      <div className="buttons">
        <AbortButton />
        <ManuallyEntryCloseButton />
      </div>
    </div>
  );
}
