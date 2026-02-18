import { AppLog } from "../../../types/appLog";
import { CaseDropError } from "../constants";
import { OverlayEvent } from "../../../types/overlay";

export function AppLogManager({ overlayEvent }: { overlayEvent: OverlayEvent }) {
  const buildChildren = (appLog: AppLog) => {
    if (appLog.type === "likeCountGoalPromotion") {
      return (
        <div>
          高評価数の小目標({appLog.goalValue}
          )を達成しました。参加者に達成ボーナスポイントが付与されます。
        </div>
      );
    } else if (appLog.type === "likeCountGoalAccomplished") {
      return (
        <div>
          高評価数の目標({appLog.goalValue}
          )を達成しました。参加者に達成ボーナスポイントが付与されます。
        </div>
      );
    } else if (appLog.type === "viewerCountGoalPromotion") {
      return (
        <div>
          同接数の小目標({appLog.goalValue}
          )を達成しました。参加者に達成ボーナスポイントが付与されます。
        </div>
      );
    } else if (appLog.type === "viewerCountGoalAccomplished") {
      return (
        <div>
          同接数の目標({appLog.goalValue}
          )を達成しました。参加者に達成ボーナスポイントが付与されます。
        </div>
      );
    } else if (appLog.type === "subscriberCountGoalAccomplished") {
      return (
        <div>
          チャンネル登録者数の目標({appLog.goalValue}
          )を達成しました。参加者に達成ボーナスポイントが付与されます。
        </div>
      );
    } else {
      throw new CaseDropError(appLog);
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
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: "rgba(0, 0, 0, 0.25)",
      }}
    >
      {item && (
        <div className="app-log-item app-log-item-animation" key={item.key}>
          {item.children}
        </div>
      )}
    </div>
  );
}
