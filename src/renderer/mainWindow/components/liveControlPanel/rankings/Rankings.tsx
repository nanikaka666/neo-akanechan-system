import { useRankings } from "../../hooks/useRankings";

export function Rankings() {
  const [
    rankings,
    reflectRankingsToOverlayEnabled,
    isRankingsShownOnOverlay,
    onClickReflectRankingButton,
    onClickHideRankingButton,
  ] = useRankings();

  return rankings ? (
    <div>
      <span style={{ position: "absolute", top: 0, right: 0 }}>
        更新日時: {rankings.updatedAt.toLocaleString()}
      </span>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onClickReflectRankingButton(rankings);
          }}
          disabled={!reflectRankingsToOverlayEnabled}
        >
          ランキングを配信画面に映す
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onClickHideRankingButton();
          }}
          disabled={!isRankingsShownOnOverlay}
        >
          配信画面のランキング表示をやめる
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
