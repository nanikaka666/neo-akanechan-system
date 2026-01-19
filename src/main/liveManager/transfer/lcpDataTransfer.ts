import { WebContents } from "electron";
import { DataSource } from "../dataSource";
import { WebContentsWrapper } from "../../../main/webContentsWrapper";

export class LcpDataTransfer {
  readonly #webContents: WebContents;
  readonly #dataSource: DataSource;
  constructor(webContents: WebContents, dataSource: DataSource) {
    this.#webContents = webContents;
    this.#dataSource = dataSource;
  }
  syncLiveStatistics() {
    WebContentsWrapper.send(
      this.#webContents,
      "tellLiveStatistics",
      this.#dataSource.getLiveStatisticsDataContainer().get(),
    );
  }
}
