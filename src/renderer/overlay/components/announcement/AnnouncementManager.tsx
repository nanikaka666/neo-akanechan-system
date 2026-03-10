import { Announcement } from "../../../../types/announcement";
import { OverlayEvent } from "../../../../types/overlay";
import { CaseDropError } from "../../constants";

export function AnnouncementManager({ overlayEvent }: { overlayEvent: OverlayEvent }) {
  const buildChildren = (announcement: Announcement) => {
    if (announcement.type === "likeCountGoalPromotion") {
      return (
        <div>
          <span className="object-sentence font-noto-bold">高評価数</span>の小目標(
          {announcement.goalValue}
          )を達成しました。参加者に
          <span className="bonus-sentence font-noto-bold">達成ボーナスポイント</span>
          が付与されます。
        </div>
      );
    } else if (announcement.type === "likeCountGoalAccomplished") {
      return (
        <div>
          <span className="object-sentence font-noto-bold">高評価数</span>の目標(
          {announcement.goalValue}
          )を達成しました。参加者に
          <span className="bonus-sentence font-noto-bold">達成ボーナスポイント</span>
          が付与されます。
        </div>
      );
    } else if (announcement.type === "viewerCountGoalPromotion") {
      return (
        <div>
          <span className="object-sentence font-noto-bold">同接数</span>の小目標(
          {announcement.goalValue}
          )を達成しました。参加者に
          <span className="bonus-sentence font-noto-bold">達成ボーナスポイント</span>
          が付与されます。
        </div>
      );
    } else if (announcement.type === "viewerCountGoalAccomplished") {
      return (
        <div>
          <span className="object-sentence font-noto-bold">同接数</span>の目標(
          {announcement.goalValue}
          )を達成しました。参加者に
          <span className="bonus-sentence font-noto-bold">達成ボーナスポイント</span>
          が付与されます。
        </div>
      );
    } else if (announcement.type === "subscriberCountGoalAccomplished") {
      return (
        <div>
          <span className="object-sentence font-noto-bold">チャンネル登録数</span>の目標(
          {announcement.goalValue}
          )を達成しました。参加者に
          <span className="bonus-sentence font-noto-bold">達成ボーナスポイント</span>
          が付与されます。
        </div>
      );
    } else if (announcement.type === "competitionPayout") {
      return (
        <div>
          正解は
          <span className="object-sentence font-noto-bold">
            {announcement.answer.toLocaleUpperCase()}: {announcement.optionStr}
          </span>
          でした。
          {announcement.betCount > 0 ? (
            <span>
              正解者<span className="font-noto-bold">({announcement.betCount}名)</span>に
              <span className="bonus-sentence font-noto-bold">勝利ボーナスポイント</span>
              が分配されます。
            </span>
          ) : (
            ""
          )}
        </div>
      );
    } else {
      throw new CaseDropError(announcement);
    }
  };

  const item =
    overlayEvent.type === "noEvent"
      ? undefined
      : {
          key: overlayEvent.announcement.logId,
          children: buildChildren(overlayEvent.announcement),
        };

  return item ? (
    <div className="announcement-container">
      <div className="announcement announcement-animation font-noto" key={item.key}>
        {item.children}
      </div>
    </div>
  ) : null;
}
