import { HeldCompetition } from "../../../../../types/competition";
import { AbortButton } from "./AbortButton";
import { BetStatusView } from "./BetStatusView";
import { ManuallyEntryCloseButton } from "./ManuallyEntryCloseButton";

export interface HeldProps {
  status: HeldCompetition;
}

export function Held({ status }: HeldProps) {
  return (
    <div key={status.settings.competitionId}>
      <div>問題: {status.settings.question}</div>
      <div>受付締切: {status.settings.scheduledClosedAt.toLocaleString()}</div>
      <BetStatusView status={status} />
      <AbortButton />
      <ManuallyEntryCloseButton />
    </div>
  );
}
