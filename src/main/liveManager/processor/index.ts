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

  subscriberCount(nextSubscriberCount: number) {
    const { maxSubscriberCount } = this.#dataSource.getLiveStatistics();
    if (maxSubscriberCount < nextSubscriberCount) {
      // todo: max subscriber count is updated.
    }
    this.#dataSource.updateLiveStatistics({
      currentSubscriberCount: nextSubscriberCount,
      maxSubscriberCount: Math.max(maxSubscriberCount, nextSubscriberCount),
    });
    this.#lcpDataTransfer.syncLiveStatistics();
  }

  likeCount(nextLikeCount: number) {
    const { maxLikeCount } = this.#dataSource.getLiveStatistics();
    if (maxLikeCount < nextLikeCount) {
      // todo: max like count is updated.
    }
    this.#dataSource.updateLiveStatistics({
      currentLikeCount: nextLikeCount,
      maxLikeCount: Math.max(maxLikeCount, nextLikeCount),
    });
    this.#lcpDataTransfer.syncLiveStatistics();
  }

  viewerCount(nextViewerCount: number) {
    const { maxLiveViewCount } = this.#dataSource.getLiveStatistics();
    if (maxLiveViewCount < nextViewerCount) {
      // todo: max viewer count is updated.
    }
    this.#dataSource.updateLiveStatistics({
      currentLiveViewCount: nextViewerCount,
      maxLiveViewCount: Math.max(maxLiveViewCount, nextViewerCount),
    });
    this.#lcpDataTransfer.syncLiveStatistics();
  }
}
