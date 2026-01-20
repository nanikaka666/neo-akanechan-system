import { ChatDataManager } from "./chats";
import { FocusManager } from "./focus";
import { LiveStatisticsDataContainer } from "./liveStatistics";
import { PariticipantPointManager } from "./participantPoint";
import { StockManager } from "./stock";

export class DataSource {
  readonly #liveStatisticsDataContainer: LiveStatisticsDataContainer;
  readonly #chatDataManager: ChatDataManager;
  readonly #stockManager: StockManager;
  readonly #focusManager: FocusManager;
  readonly #pointManager: PariticipantPointManager;
  constructor(
    liveStatisticsDataContainer: LiveStatisticsDataContainer,
    chatDataContainer: ChatDataManager,
    stockManager: StockManager,
    focusManager: FocusManager,
    pointManager: PariticipantPointManager,
  ) {
    this.#liveStatisticsDataContainer = liveStatisticsDataContainer;
    this.#chatDataManager = chatDataContainer;
    this.#stockManager = stockManager;
    this.#focusManager = focusManager;
    this.#pointManager = pointManager;
  }
  getLiveStatisticsDataContainer() {
    return this.#liveStatisticsDataContainer;
  }
  getChatDataManager() {
    return this.#chatDataManager;
  }
  getStockManager() {
    return this.#stockManager;
  }
  getFocusManager() {
    return this.#focusManager;
  }
  getParticipantManager() {
    return this.#pointManager;
  }
}
