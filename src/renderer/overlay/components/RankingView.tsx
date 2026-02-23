import { useState } from "react";
import { Ranking } from "./Ranking";
import { RankingOthers } from "./RankingOthers";
import { PariticipantPointRankings } from "../../../types/participantPoint";

export function RankingView() {
  const [ranking, setRanking] = useState<PariticipantPointRankings | undefined>();
  return (
    ranking && (
      <>
        <Ranking
          first={ranking.items[0]}
          second={ranking.items[1]}
          third={ranking.items[2]}
          updatedAt={ranking.updatedAt}
        />
        <RankingOthers list={ranking.items.slice(3)} />
      </>
    )
  );
}
