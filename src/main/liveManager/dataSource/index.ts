import { LiveStatistics } from "../../../types/liveStatistics";
import { LiveStatisticsDataContainer } from "./liveStatistics";
import { StockManager } from "./stock";

export class DataSource {
  readonly #liveStatisticsDataContainer: LiveStatisticsDataContainer;
  readonly #stockManager: StockManager;
  constructor(
    liveStatisticsDataContainer: LiveStatisticsDataContainer,
    stockManager: StockManager,
  ) {
    this.#liveStatisticsDataContainer = liveStatisticsDataContainer;
    this.#stockManager = stockManager;
  }
  getLiveStatisticsDataContainer() {
    return this.#liveStatisticsDataContainer;
  }
  // getLiveStatistics() {
  //   return this.#liveStatisticsDataContainer.get();
  // }
  // updateLiveStatistics(newData: Partial<LiveStatistics>) {
  //   this.#liveStatisticsDataContainer.update(newData);
  // }
}
