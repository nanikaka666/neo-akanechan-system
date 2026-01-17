import { LiveLaunchProperties } from "../../../types/liveLaunchProperties";
import { DataSource } from "../dataSource";

export class Processor {
  readonly #liveLaunchProperties: LiveLaunchProperties;
  readonly #dataSource: DataSource;
  constructor(liveLaunchProperties: LiveLaunchProperties, dataSource: DataSource) {
    this.#liveLaunchProperties = liveLaunchProperties;
    this.#dataSource = dataSource;
  }

  subscriberCount(subscriberCount: number) {
    const { maxSubscriberCount } = this.#dataSource.getLiveStatistics();
    if (maxSubscriberCount < subscriberCount) {
      // todo: max subscriber count is updated.
    }
    this.#dataSource.updateLiveStatistics({
      currentSubscriberCount: subscriberCount,
      maxSubscriberCount: Math.max(maxSubscriberCount, subscriberCount),
    });
    // todo: data transfer
  }
}
