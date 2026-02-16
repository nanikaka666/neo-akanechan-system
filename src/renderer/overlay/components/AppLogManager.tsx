import { useCallback, useState } from "react";
import { AppLog } from "../../../types/appLog";
import { AppLogItem, AppLogItemProps } from "./AppLogItem";
import { CaseDropError } from "../constants";

export function AppLogManager() {
  const [buffer, setBuffer] = useState<AppLog[]>([]);

  const buildChildren = (appLog: AppLog) => {
    if (appLog.type === "likeCountGoalPromotion") {
      return <div>like promotion</div>;
    } else if (appLog.type === "likeCountGoalAccomplished") {
      return <div>like accomplished</div>;
    } else if (appLog.type === "viewerCountGoalPromotion") {
      return <div>viewer promotion</div>;
    } else if (appLog.type === "viewerCountGoalAccomplished") {
      return <div>viewer accomplished</div>;
    } else if (appLog.type === "subscriberCountGoalAccomplished") {
      return <div>subscriber accomplished</div>;
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
    <ul>
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
