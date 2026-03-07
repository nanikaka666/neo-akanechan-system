import { HeldCompetition } from "../../../../types/competition";

import { CompetitionStatusView } from "./CompetitionStatusView";

interface HeldViewProps {
  status: HeldCompetition;
}

export function HeldView({ status }: HeldViewProps) {
  return (
    <div>
      <CompetitionStatusView status={status} />

      <div>
        正解だと思う選択肢を選び、チャット欄にスラッシュ(/)をつけて書き込んでください。例:
        選択肢AにBetするなら「/A」or「/a」です。
      </div>

      <div>参加締切: {status.settings.scheduledClosedAt.toLocaleString().split(" ")[1]}</div>
    </div>
  );
}
