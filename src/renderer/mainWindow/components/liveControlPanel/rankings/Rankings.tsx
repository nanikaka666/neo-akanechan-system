import { useRankings } from "../../../hooks/useRankings";

export function Rankings() {
  const [
    rankings,
    reflectRankingsToOverlayEnabled,
    isRankingsShownOnOverlay,
    onClickReflectRankingButton,
    onClickHideRankingButton,
  ] = useRankings();

  return rankings ? (
    <div className="rankings">
      <div>更新日時: {rankings.updatedAt.toLocaleString()}</div>
      <div>
        <button
          className="action-button"
          onClick={(e) => {
            e.preventDefault();
            onClickReflectRankingButton(rankings);
          }}
          disabled={!reflectRankingsToOverlayEnabled}
        >
          ランキングを配信画面に映す
        </button>
        <button
          className="action-button"
          onClick={(e) => {
            e.preventDefault();
            onClickHideRankingButton();
          }}
          disabled={!isRankingsShownOnOverlay}
        >
          配信画面のランキング表示をやめる
        </button>
      </div>
      <div className="list">
        {rankings.items.map((item, idx) => {
          return (
            <div key={idx} className="item">
              <div>#{item.rank}</div>
              <div className="author">
                <img src={item.participantPoint.author.profileImageUrl} />
                <div>{item.participantPoint.author.name}</div>
              </div>
              <div>{item.participantPoint.point}</div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div>ランキングデータがありません</div>
  );
}
