import { WebContents } from "electron";
import { DataSource } from "./dataSource";
import { LiveManager } from "./liveManager";
import { LcpDataTransfer } from "./transfer/lcpDataTransfer";
import { Processor } from "./processor";
import { LiveLaunchProperties } from "../../types/liveLaunchProperties";
import { ChannelDataFetcher } from "./dataFetcher/channelDataFetcher";
import { VideoDataFetcher } from "./dataFetcher/videoDataFetcher";
import { LiveChatDataFetcher } from "./dataFetcher/liveChatDataFetcher";
import { LiveStatisticsDataContainer } from "./dataSource/liveStatistics";
import { StockManager } from "./dataSource/stock";

let liveManager: LiveManager | undefined;

export async function setupLiveManager(
  webContents: WebContents,
  liveLaunchProperties: LiveLaunchProperties,
) {
  if (liveManager !== undefined) {
    liveManager.close();
    liveManager = undefined;
  }
  const liveStatisticsDataContainer = new LiveStatisticsDataContainer();
  const stockManager = new StockManager();
  const dataSource = new DataSource(liveStatisticsDataContainer, stockManager);
  const lcpDataTransfer = new LcpDataTransfer(webContents, dataSource);
  const processor = new Processor(liveLaunchProperties, dataSource, lcpDataTransfer);
  const channelDataFetcher = new ChannelDataFetcher(liveLaunchProperties.channel.id, 60 * 1000);
  const videoDataFetcher = new VideoDataFetcher(liveLaunchProperties.live.videoId, 15 * 1000);
  const liveChatDataFetcher = new LiveChatDataFetcher(liveLaunchProperties.live.liveChatId);
  liveManager = new LiveManager(
    liveLaunchProperties,
    dataSource,
    processor,
    channelDataFetcher,
    videoDataFetcher,
    liveChatDataFetcher,
  );
  await liveManager.setup();
}

export function getLiveManager() {
  if (liveManager === undefined) {
    throw new Error("LiveManager has not been setup.");
  }
  return liveManager;
}

export function cleanupLiveManager() {
  if (liveManager === undefined) {
    return;
  }
  liveManager.close();
  liveManager = undefined;
}
