import { Announcement } from "../../../../types/announcement";
import { OverlayEvent } from "../../../../types/overlay";
import { CaseDropError } from "../../constants";

export function AnnouncementManager({ overlayEvent }: { overlayEvent: OverlayEvent }) {
  const buildChildren = (announcement: Announcement) => {
    if (announcement.type === "likeCountGoalPromotion") {
      return (
        <div>
          高評価数の小目標({announcement.goalValue}
          )を達成しました。参加者に達成ボーナスポイントが付与されます。
        </div>
      );
    } else if (announcement.type === "likeCountGoalAccomplished") {
      return (
        <div>
          高評価数の目標({announcement.goalValue}
          )を達成しました。参加者に達成ボーナスポイントが付与されます。
        </div>
      );
    } else if (announcement.type === "viewerCountGoalPromotion") {
      return (
        <div>
          同接数の小目標({announcement.goalValue}
          )を達成しました。参加者に達成ボーナスポイントが付与されます。
        </div>
      );
    } else if (announcement.type === "viewerCountGoalAccomplished") {
      return (
        <div>
          同接数の目標({announcement.goalValue}
          )を達成しました。参加者に達成ボーナスポイントが付与されます。
        </div>
      );
    } else if (announcement.type === "subscriberCountGoalAccomplished") {
      return (
        <div>
          チャンネル登録者数の目標({announcement.goalValue}
          )を達成しました。参加者に達成ボーナスポイントが付与されます。
        </div>
      );
    } else if (announcement.type === "competitionPayout") {
      return (
        <div>
          コンペの結果が({announcement.answer.toLocaleUpperCase()}: {announcement.optionStr}
          )に決定しました。
          {announcement.betCount > 0
            ? `正解した${announcement.betCount}名に勝利ポイントが付与されます。`
            : ""}
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
          key: overlayEvent.appLog.logId,
          children: buildChildren(overlayEvent.appLog),
        };

  return (
    <div className="announcement-container">
      {item && (
        <div className="announcement announcement-animation" key={item.key}>
          {item.children}
        </div>
      )}
    </div>
  );
}
