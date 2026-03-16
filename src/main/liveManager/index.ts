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
import { ChatDataManager } from "./dataSource/chats";
import { FocusManager } from "./dataSource/focus";
import { PariticipantPointManager } from "./dataSource/participantPoint";
import { OverlayDataTransfer } from "./transfer/overlayDataTransfer";
import { LiveSettingsManager } from "./dataSource/settings";
import { GoalsManager } from "./dataSource/goals";
import { ShowRankingManager } from "./dataSource/showRanking";
import { CompetitionManager } from "./dataSource/competition";
import { LiveLaunchPropertiesDataContainer } from "./dataSource/liveLaunchProperties";

let liveManager: LiveManager | undefined;

export function setupLiveManager(liveLaunchProperties: LiveLaunchProperties) {
  if (liveManager !== undefined) {
    liveManager.close();
    liveManager = undefined;
  }
  const liveLaunchPropertiesDataContainer = new LiveLaunchPropertiesDataContainer(
    liveLaunchProperties,
  );
  const liveStatisticsDataContainer = new LiveStatisticsDataContainer();
  const chatDataManager = new ChatDataManager();
  const stockManager = new StockManager();
  const focusManager = new FocusManager();
  const pointManager = new PariticipantPointManager();
  const liveSettingsManager = new LiveSettingsManager();
  const goalsManager = new GoalsManager();
  const showRankingManager = new ShowRankingManager();
  const competitionManager = new CompetitionManager();
  const dataSource = new DataSource(
    liveLaunchPropertiesDataContainer,
    liveStatisticsDataContainer,
    chatDataManager,
    stockManager,
    focusManager,
    pointManager,
    liveSettingsManager,
    goalsManager,
    showRankingManager,
    competitionManager,
  );
  const lcpDataTransfer = new LcpDataTransfer(dataSource);
  const overlayDataTransfer = new OverlayDataTransfer(dataSource);
  const processor = new Processor(dataSource, lcpDataTransfer, overlayDataTransfer);
  const channelDataFetcher = new ChannelDataFetcher(liveLaunchProperties.channel.id, 60 * 1000);
  const videoDataFetcher = new VideoDataFetcher(liveLaunchProperties.live.videoId, 15 * 1000);
  const liveChatDataFetcher = new LiveChatDataFetcher(liveLaunchProperties.live.liveChatId);
  liveManager = new LiveManager(
    dataSource,
    processor,
    channelDataFetcher,
    videoDataFetcher,
    liveChatDataFetcher,
  );
}

export function isExistLiveManager() {
  return liveManager !== undefined;
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
