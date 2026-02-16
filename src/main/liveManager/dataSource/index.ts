import { ChatDataManager } from "./chats";
import { FocusManager } from "./focus";
import { GoalsManager } from "./goals";
import { LiveStatisticsDataContainer } from "./liveStatistics";
import { PariticipantPointManager } from "./participantPoint";
import { LiveSettingsManager } from "./settings";
import { StockManager } from "./stock";

export class DataSource {
  readonly #liveStatisticsDataContainer: LiveStatisticsDataContainer;
  readonly #chatDataManager: ChatDataManager;
  readonly #stockManager: StockManager;
  readonly #focusManager: FocusManager;
  readonly #pointManager: PariticipantPointManager;
  readonly #liveSettingsManager: LiveSettingsManager;
  readonly #goalsManager: GoalsManager;
  constructor(
    liveStatisticsDataContainer: LiveStatisticsDataContainer,
    chatDataContainer: ChatDataManager,
    stockManager: StockManager,
    focusManager: FocusManager,
    pointManager: PariticipantPointManager,
    liveSettingsManager: LiveSettingsManager,
    goalsManager: GoalsManager,
  ) {
    this.#liveStatisticsDataContainer = liveStatisticsDataContainer;
    this.#chatDataManager = chatDataContainer;
    this.#stockManager = stockManager;
    this.#focusManager = focusManager;
    this.#pointManager = pointManager;
    this.#liveSettingsManager = liveSettingsManager;
    this.#goalsManager = goalsManager;
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
  getLiveSettingsManager() {
    return this.#liveSettingsManager;
  }
  getGoalsManager() {
    return this.#goalsManager;
  }
}
