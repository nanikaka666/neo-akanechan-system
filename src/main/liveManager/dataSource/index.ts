import { ChatDataManager } from "./chats";
import { FocusManager } from "./focus";
import { LiveStatisticsDataContainer } from "./liveStatistics";
import { StockManager } from "./stock";

export class DataSource {
  readonly #liveStatisticsDataContainer: LiveStatisticsDataContainer;
  readonly #chatDataManager: ChatDataManager;
  readonly #stockManager: StockManager;
  readonly #focusManager: FocusManager;
  constructor(
    liveStatisticsDataContainer: LiveStatisticsDataContainer,
    chatDataContainer: ChatDataManager,
    stockManager: StockManager,
    focusManager: FocusManager,
  ) {
    this.#liveStatisticsDataContainer = liveStatisticsDataContainer;
    this.#chatDataManager = chatDataContainer;
    this.#stockManager = stockManager;
    this.#focusManager = focusManager;
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
}
