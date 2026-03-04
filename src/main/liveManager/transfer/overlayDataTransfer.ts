import { ChatAuthor } from "../../../types/liveChatItem";
import { getWindowManager } from "../../../main/window";
import { WebContentsWrapper } from "../../../main/webContentsWrapper";
import { NoEvent, OverlayEvent, PointInfoFromMainProcess } from "../../../types/overlay";
import { DataSource } from "../dataSource";
import { ChatLogData } from "../../../types/chatLog";

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

  sendOverlayEvent(event: Exclude<OverlayEvent, NoEvent>) {
    WebContentsWrapper.send(this.#getWebContents(), "tellOverlayEvent", event);
  }

  sendChatLog(data: ChatLogData) {
    const bet = this.#dataSource
      .getCompetitionManager()
      .getBets()
      .filter((bet) => bet.author.channelId.id === data.author.channelId.id);
    WebContentsWrapper.send(this.#getWebContents(), "tellChatLog", {
      data,
      votedTo: bet.length === 1 ? bet[0].betTo : undefined,
    });
  }

  syncFocusView() {
    const focusStatus = this.#dataSource.getFocusManager().getFocusStatus();
    WebContentsWrapper.send(
      this.#getWebContents(),
      "tellFocusViewItem",
      focusStatus.type === "unfocused" ? undefined : focusStatus.item,
    );
  }

  syncRanking() {
    WebContentsWrapper.send(
      this.#getWebContents(),
      "tellRankingView",
      this.#dataSource.getShowRankingManager().get(),
    );
  }

  syncCompetitionStatus() {
    WebContentsWrapper.send(
      this.#getWebContents(),
      "tellCompetitionStatus",
      this.#dataSource.getCompetitionManager().get(),
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
