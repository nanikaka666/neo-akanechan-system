import { LiveStatistics } from "../../../types/liveStatistics";
import { LiveStatisticsDataContainer } from "./liveStatistics";

export class DataSource {
  readonly #liveStatisticsDataContainer: LiveStatisticsDataContainer;
  constructor(liveStatisticsDataContainer: LiveStatisticsDataContainer) {
    this.#liveStatisticsDataContainer = liveStatisticsDataContainer;
  }
  getLiveStatistics() {
    return this.#liveStatisticsDataContainer.get();
  }
  updateLiveStatistics(newData: Partial<LiveStatistics>) {
    this.#liveStatisticsDataContainer.update(newData);
  }
}
