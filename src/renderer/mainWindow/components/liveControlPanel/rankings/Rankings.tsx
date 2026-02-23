import { useEffect, useState } from "react";
import { PariticipantPointRankings } from "../../../../../types/participantPoint";

export function Rankings() {
  const [rankings, setRankings] = useState<PariticipantPointRankings>();
  const [showButtonDisabled, setShowButtonDisabled] = useState(false);
  useEffect(() => {
    const remover = window.ipcApi.registerRankingsListener((e, rankings) => {
      setRankings((_) => rankings);
      setShowButtonDisabled((_) => false);
    });
    return () => remover();
  }, []);
  return rankings ? (
    <div>
      <span style={{ position: "absolute", top: 0, right: 0 }}>
        更新日時: {rankings.updatedAt.toLocaleString()}
      </span>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowButtonDisabled((_) => true);
            window.ipcApi.requestShowRanking(rankings);
          }}
          disabled={showButtonDisabled}
        >
          ランキングを配信画面に映す
        </button>
      </div>
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
