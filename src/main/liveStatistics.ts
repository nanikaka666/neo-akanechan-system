import { WebContents } from "electron";
import { LiveStatistics } from "../ipcEvent";
import { WebContentsWrapper } from "./webContentsWrapper";

let liveStatistics: LiveStatistics;
let webContents: WebContents | undefined;

export function setupLiveStatistics(w: WebContents) {
  liveStatistics = {
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
  };
  webContents = w;
}

export function updateLiveStatistics(newData: Partial<LiveStatistics>) {
  liveStatistics = { ...liveStatistics, ...newData };
  WebContentsWrapper.send(webContents!, "tellLiveStatistics", liveStatistics);
}
