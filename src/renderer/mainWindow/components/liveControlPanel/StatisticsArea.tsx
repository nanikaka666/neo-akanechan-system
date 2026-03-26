import { useLiveStatistics } from "../../../hooks/useLiveStatistics";

export function StatisticsArea() {
  const liveStatistics = useLiveStatistics();

  return (
    <div className="statistics">
      <div>
        高評価数(最大): {`${liveStatistics.currentLikeCount} (${liveStatistics.maxLikeCount})`}
      </div>
      <div>
        同接数(最大): {`${liveStatistics.currentLiveViewCount}(${liveStatistics.maxLiveViewCount})`}
      </div>
      <div>テキストチャット: {liveStatistics.textChatCount}</div>
      <div>SuperChat: {liveStatistics.superChatCount}</div>
      <div>SuperSticker: {liveStatistics.superStickerCount}</div>
      <div>チャットUU: {liveStatistics.chatUUCount}</div>
      <div>
        チャンネル登録者数(最大):{" "}
        {`${liveStatistics.currentSubscriberCount}(${liveStatistics.maxSubscriberCount})`}
      </div>
      <div>新メンバーシップ: {liveStatistics.newMembershipsCount}</div>
      <div>マイルストーン更新: {liveStatistics.membershipMilestoneCount}</div>
      <div>ギフト回数: {liveStatistics.giftCount}</div>
      <div>ギフト受取数: {liveStatistics.redemptionGiftCount}</div>
      <div>ストック数: {liveStatistics.stocksCount}</div>
      <div>
        配信開始時間:{" "}
        {liveStatistics.actualStartTime ? liveStatistics.actualStartTime.toLocaleString() : "---"}
      </div>
    </div>
  );
}
