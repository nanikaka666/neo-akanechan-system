import { useCallback, useState } from "react";
import { AppLog } from "../../../types/appLog";
import { AppLogItem, AppLogItemProps } from "./AppLogItem";
import { CaseDropError } from "../constants";

export function AppLogManager() {
  const [buffer, setBuffer] = useState<AppLog[]>([]);

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

  const convert = useCallback(() => {
    return buffer.map((appLog) => {
      return {
        itemId: appLog.logId,
        animamtionEndFunc: () => {
          setBuffer((prev) => prev.filter((value) => value.logId !== appLog.logId));
        },
        children: buildChildren(appLog),
      } satisfies AppLogItemProps;
    });
  }, [buffer]);

  return (
    <ul
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        listStyle: "none",
        margin: 0,
        padding: 0,
        backgroundColor: "rgba(0, 0, 0, 0.25)",
      }}
    >
      {convert().map((item) => {
        return (
          <AppLogItem key={item.itemId} {...item}>
            {item.children}
          </AppLogItem>
        );
      })}
    </ul>
  );
}
