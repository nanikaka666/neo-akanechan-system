import { useEffect, useState } from "react";
import { RankingLeaders } from "./RankingLeaders";
import { RankingOthers } from "./RankingOthers";
import { PariticipantPointRankings } from "../../../../types/participantPoint";

export function Ranking() {
  const [ranking, setRanking] = useState<PariticipantPointRankings | undefined>();

  useEffect(() => {
    const remover = window.ipcApi.overlay.registerRankingViewListener((_, maybeRanking) => {
      setRanking((_) => maybeRanking);
    });
    return () => remover();
  }, []);

  return (
    ranking && (
      <div className="ranking-container">
        <RankingLeaders
          first={ranking.items[0]}
          second={ranking.items[1]}
          third={ranking.items[2]}
          updatedAt={ranking.updatedAt}
        />
        <RankingOthers list={ranking.items.slice(3)} updatedAt={ranking.updatedAt} />
      </div>
    )
  );
}
