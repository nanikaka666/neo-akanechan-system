import { LiveStatistics } from "../../../types/liveStatistics";
import { LiveStatisticsManager } from "../../liveStatistics";

export class DataSource {
  readonly #liveStatisticsManager: LiveStatisticsManager;
  constructor() {
    this.#liveStatisticsManager = new LiveStatisticsManager();
  }
  getLiveStatistics() {
    return this.#liveStatisticsManager.get();
  }
  updateLiveStatistics(newData: Partial<LiveStatistics>) {
    this.#liveStatisticsManager.updateLiveStatistics(newData);
  }
}
