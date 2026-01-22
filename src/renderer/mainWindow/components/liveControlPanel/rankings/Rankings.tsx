import { useEffect, useState } from "react";
import { PariticipantPointRankings } from "../../../../../types/participantPoint";

export function Rankings() {
  const [rankings, setRankings] = useState<PariticipantPointRankings>();
  useEffect(() => {
    const remover = window.ipcApi.registerRankingsListener((e, rankings) => {
      setRankings((_) => rankings);
    });
    return () => remover();
  }, []);
  return rankings ? (
    <div>
      <span style={{ position: "absolute", top: 0, right: 0 }}>
        更新日時: {rankings.updatedAt.toLocaleString()}
      </span>
      {rankings.items.map((item, idx) => {
        return (
          <div key={idx}>
            <span>#{item.rank}: </span>
            <span>
              <img
                src={item.participantPoint.author.profileImageUrl}
                style={{ width: "32px", height: "32px" }}
              />
              {item.participantPoint.author.name}
            </span>
            <span> | {item.participantPoint.point} pts.</span>
          </div>
        );
      })}
    </div>
  ) : (
    <div>ランキングデータがありません</div>
  );
}
