import { CompetitionStatus } from "../competition";
import { LiveSettings } from "../liveSettings";
import { LiveStatistics } from "../liveStatistics";

export interface CommonIpcEvent {
  /**
   * Notify LiveStatistics to renderer.
   */
  tellLiveStatistics: (statistics: LiveStatistics) => void;

  /**
   * Notify LiveSettings.
   */
  tellLiveSettings: (liveSettings: LiveSettings) => void;

  /**
   * Request to LiveManager that sync LiveSettings.
   *
   * mainly used when want to fetch initial LiveSettings.
   */
  requestSyncLiveSettings: () => boolean;

  /**
   * Notify latest CompetitionStatus.
   */
  tellCompetitionStatus: (status: CompetitionStatus) => void;
}
