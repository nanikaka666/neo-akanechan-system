import { ChatAuthor } from "../../../types/liveChatItem";
import { WebContentsWrapper } from "../../../main/webContentsWrapper";
import { NoEvent, OverlayEvent, PointInfoFromMainProcess } from "../../../types/overlay";
import { DataSource } from "../dataSource";
import { ChatLogData } from "../../../types/chatLog";
import { getWindowManager } from "../../../main/window";

export class OverlayDataTransfer {
  readonly #dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  sendAmountOfPoint(author: ChatAuthor, amountOfPoint: number) {
    const webContents = getWindowManager().getOverlayWindowWebContents();
    if (webContents === undefined) {
      return;
    }
    WebContentsWrapper.send(webContents, "tellAmountOfPoint", {
      img: author.profileImageUrl,
      point: amountOfPoint,
    } satisfies PointInfoFromMainProcess);
  }

  syncLiveSettings() {
    const webContents = getWindowManager().getOverlayWindowWebContents();
    if (webContents === undefined) {
      return;
    }
    WebContentsWrapper.send(
      webContents,
      "tellLiveSettings",
      this.#dataSource.getLiveSettingsManager().get(),
    );
  }

  syncLiveStatistics() {
    const webContents = getWindowManager().getOverlayWindowWebContents();
    if (webContents === undefined) {
      return;
    }
    WebContentsWrapper.send(
      webContents,
      "tellLiveStatistics",
      this.#dataSource.getLiveStatisticsDataContainer().get(),
    );
  }

  sendOverlayEvent(event: Exclude<OverlayEvent, NoEvent>) {
    const webContents = getWindowManager().getOverlayWindowWebContents();
    if (webContents === undefined) {
      return;
    }
    WebContentsWrapper.send(webContents, "tellOverlayEvent", event);
  }

  sendChatLog(data: ChatLogData) {
    const webContents = getWindowManager().getOverlayWindowWebContents();
    if (webContents === undefined) {
      return;
    }
    const bet = this.#dataSource
      .getCompetitionManager()
      .getBets()
      .filter((bet) => bet.author.channelId.id === data.author.channelId.id);
    WebContentsWrapper.send(webContents, "tellChatLog", {
      data,
      votedTo: bet.length === 1 ? bet[0].betTo : undefined,
    });
  }

  syncFocusView() {
    const webContents = getWindowManager().getOverlayWindowWebContents();
    if (webContents === undefined) {
      return;
    }
    const focusStatus = this.#dataSource.getFocusManager().getFocusStatus();
    WebContentsWrapper.send(
      webContents,
      "tellFocusViewItem",
      focusStatus.type === "unfocused" ? undefined : focusStatus.item,
    );
  }

  syncRanking() {
    const webContents = getWindowManager().getOverlayWindowWebContents();
    if (webContents === undefined) {
      return;
    }
    WebContentsWrapper.send(
      webContents,
      "tellRankingView",
      this.#dataSource.getShowRankingManager().get(),
    );
  }

  syncCompetitionStatus() {
    const webContents = getWindowManager().getOverlayWindowWebContents();
    if (webContents === undefined) {
      return;
    }
    WebContentsWrapper.send(
      webContents,
      "tellCompetitionStatus",
      this.#dataSource.getCompetitionManager().get(),
    );
  }
}
