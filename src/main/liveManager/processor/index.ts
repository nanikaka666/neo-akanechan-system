import { LiveLaunchProperties } from "../../../types/liveLaunchProperties";
import { DataSource } from "../dataSource";
import { LcpDataTransfer } from "../transfer/lcpDataTransfer";

export class Processor {
  readonly #liveLaunchProperties: LiveLaunchProperties;
  readonly #dataSource: DataSource;
  readonly #lcpDataTransfer: LcpDataTransfer;
  constructor(
    liveLaunchProperties: LiveLaunchProperties,
    dataSource: DataSource,
    lcpDataTransfer: LcpDataTransfer,
  ) {
    this.#liveLaunchProperties = liveLaunchProperties;
    this.#dataSource = dataSource;
    this.#lcpDataTransfer = lcpDataTransfer;
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
    this.#lcpDataTransfer.syncLiveStatistics();
  }
}
