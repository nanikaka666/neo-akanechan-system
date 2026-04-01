import { useLiveStatistics } from "../../../hooks/useLiveStatistics";

export function StatisticsArea() {
  const liveStatistics = useLiveStatistics();

  return (
    <div className="statistics">
      <h2>統計情報</h2>
      <ul>
        <li>
          <div>高評価数(最大):</div>
          <div>{`${liveStatistics.currentLikeCount} (${liveStatistics.maxLikeCount})`}</div>
        </li>
        <li>
          <div>同接数(最大):</div>
          <div>{`${liveStatistics.currentLiveViewCount}(${liveStatistics.maxLiveViewCount})`}</div>
        </li>
        <li>
          <div>テキストチャット:</div>
          <div>{liveStatistics.textChatCount}</div>
        </li>
        <li>
          <div>SuperChat:</div>
          <div>{liveStatistics.superChatCount}</div>
        </li>
        <li>
          <div>SuperSticker:</div>
          <div>{liveStatistics.superStickerCount}</div>
        </li>
        <li>
          <div>チャットUU:</div>
          <div>{liveStatistics.chatUUCount}</div>
        </li>
        <li>
          <div>チャンネル登録者数(最大):</div>
          <div>
            {`${liveStatistics.currentSubscriberCount}(${liveStatistics.maxSubscriberCount})`}
          </div>
        </li>
        <li>
          <div>新メンバーシップ:</div>
          <div>{liveStatistics.newMembershipsCount}</div>
        </li>
        <li>
          <div>マイルストーン更新:</div>
          <div>{liveStatistics.membershipMilestoneCount}</div>
        </li>
        <li>
          <div>ギフト回数:</div>
          <div>{liveStatistics.giftCount}</div>
        </li>
        <li>
          <div>ギフト受取数:</div>
          <div>{liveStatistics.redemptionGiftCount}</div>
        </li>
        <li>
          <div>ストック数:</div>
          <div>{liveStatistics.stocksCount}</div>
        </li>
        <li>
          <div>配信開始時間:</div>
          <div>
            {liveStatistics.actualStartTime
              ? liveStatistics.actualStartTime.toLocaleString()
              : "---"}
          </div>
        </li>
      </ul>
    </div>
  );
}
