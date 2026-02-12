import { ChatAuthor } from "../../../types/liveChatItem";
import { getWindowManager } from "../../../main/window";
import { WebContentsWrapper } from "../../../main/webContentsWrapper";
import { PointInfoFromMainProcess } from "../../../renderer/overlay/types";
import { LiveSettings } from "../../../types/liveSettings";

export class OverlayDataTransfer {
  constructor() {}

  sendAmountOfPoint(author: ChatAuthor, amountOfPoint: number) {
    WebContentsWrapper.send(this.#getWebContents(), "tellAmountOfPoint", {
      img: author.profileImageUrl,
      point: amountOfPoint,
    } satisfies PointInfoFromMainProcess);
  }

  syncLiveSettings(liveSettings: LiveSettings) {
    WebContentsWrapper.send(this.#getWebContents(), "tellLiveSettings", liveSettings);
  }

  #getWebContents() {
    const res = getWindowManager().getOverlayWindowWebContents();
    if (res === undefined) {
      throw new Error("Data transfer failed by missing overlay window.");
    }
    return res;
  }
}
