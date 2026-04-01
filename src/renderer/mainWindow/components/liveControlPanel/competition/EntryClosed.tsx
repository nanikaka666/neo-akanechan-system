import { EntryClosedCompetition } from "../../../../../types/competition";
import { AbortButton } from "./AbortButton";
import { AnswerDecisionForm } from "./AnswerDecisionForm";
import { BetStatusView } from "./BetStatusView";

interface EntryClosedProps {
  status: EntryClosedCompetition;
}

export function EntryClosed({ status }: EntryClosedProps) {
  return (
    <div className="entry-closed" key={status.settings.competitionId}>
      <div>
        <h2>問題</h2>
        <div>{status.settings.question}</div>
      </div>
      <div>受付締切済み</div>
      <BetStatusView status={status} />
      <div className="buttons">
        <AnswerDecisionForm options={status.settings.options} />
        <AbortButton />
      </div>
    </div>
  );
}
