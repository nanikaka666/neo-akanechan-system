import { EntryClosedCompetition } from "../../../../../types/competition";
import { AbortButton } from "./AbortButton";
import { AnswerDecisionForm } from "./AnswerDecisionForm";
import { BetStatusView } from "./BetStatusView";

interface EntryClosedProps {
  status: EntryClosedCompetition;
}

export function EntryClosed({ status }: EntryClosedProps) {
  return (
    <div key={status.settings.competitionId}>
      <div>問題: {status.settings.question}</div>
      <div>受付締切済み</div>
      <BetStatusView status={status} />
      <AnswerDecisionForm options={status.settings.options} />
      <AbortButton />
    </div>
  );
}
