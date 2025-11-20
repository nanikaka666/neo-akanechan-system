import { useEffect, useState } from "react";
import { LiveStatistics } from "../../../../ipcEvent";

export function SideBarInfoArea() {
  const [liveStatistics, setLiveStatistics] = useState<LiveStatistics>({
    currentLikeCount: 0,
    maxLikeCount: 0,
    currentLiveViewCount: 0,
    maxLiveViewCount: 0,
    textChatCount: 0,
    superChatCount: 0,
    superStickerCount: 0,
    chatUUCount: 0,
    currentSubscriberCount: 0,
    maxSubscriberCount: 0,
    newMembershipsCount: 0,
    membershipMilestoneCount: 0,
    giftCount: 0,
    redemptionGiftCount: 0,
    stocksCount: 0,
  });

  useEffect(() => {
    window.ipcApi.registerLiveStatisticsListener((e, newLiveStatistics) => {
      setLiveStatistics((_) => newLiveStatistics);
    });
  }, []);

  return (
    <div>
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
    </div>
  );
}
