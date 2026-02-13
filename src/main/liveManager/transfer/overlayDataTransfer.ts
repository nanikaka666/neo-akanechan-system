import { ChatAuthor } from "../../../types/liveChatItem";
import { getWindowManager } from "../../../main/window";
import { WebContentsWrapper } from "../../../main/webContentsWrapper";
import { PointInfoFromMainProcess } from "../../../types/overlay";
import { DataSource } from "../dataSource";

export class OverlayDataTransfer {
  readonly #dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  sendAmountOfPoint(author: ChatAuthor, amountOfPoint: number) {
    WebContentsWrapper.send(this.#getWebContents(), "tellAmountOfPoint", {
      img: author.profileImageUrl,
      point: amountOfPoint,
    } satisfies PointInfoFromMainProcess);
  }

  syncLiveSettings() {
    WebContentsWrapper.send(
      this.#getWebContents(),
      "tellLiveSettings",
      this.#dataSource.getLiveSettingsManager().get(),
    );
  }

  syncLiveStatistics() {
    WebContentsWrapper.send(
      this.#getWebContents(),
      "tellLiveStatistics",
      this.#dataSource.getLiveStatisticsDataContainer().get(),
    );
  }

  #getWebContents() {
    const res = getWindowManager().getOverlayWindowWebContents();
    if (res === undefined) {
      throw new Error("Data transfer failed by missing overlay window.");
    }
    return res;
  }
}
