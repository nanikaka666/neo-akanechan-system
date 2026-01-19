import { LiveStatistics } from "../../../types/liveStatistics";
import { LiveStatisticsDataContainer } from "../../liveStatistics";

export class DataSource {
  readonly #liveStatisticsManager: LiveStatisticsDataContainer;
  constructor() {
    this.#liveStatisticsManager = new LiveStatisticsDataContainer();
  }
  getLiveStatistics() {
    return this.#liveStatisticsManager.get();
  }
  updateLiveStatistics(newData: Partial<LiveStatistics>) {
    this.#liveStatisticsManager.updateLiveStatistics(newData);
  }
}
