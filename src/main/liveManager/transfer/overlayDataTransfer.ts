import { ChatAuthor } from "../../../types/liveChatItem";
import { getWindowManager } from "../../../main/window";
import { WebContentsWrapper } from "../../../main/webContentsWrapper";
import { PointInfoFromMainProcess } from "../../../renderer/overlay/types";

export class OverlayDataTransfer {
  constructor() {}

  send(author: ChatAuthor, amountOfPoint: number) {
    // send
    WebContentsWrapper.send(this.#getWebContents(), "tellAmountOfPoint", {
      img: author.profileImageUrl,
      point: amountOfPoint,
    } satisfies PointInfoFromMainProcess);
  }

  #getWebContents() {
    const res = getWindowManager().getOverlayWindowWebContents();
    if (res === undefined) {
      throw new Error("Data transfer failed by missing overlay window.");
    }
    return res;
  }
}
