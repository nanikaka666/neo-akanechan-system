import { UserSettings } from "./userSettings";
import {
  Chats,
  ExtendedChatItemText,
  FocusedOnChatItem,
  MembershipAndGiftItem,
  SuperChat,
  SuperSticker,
  TextMessageChat,
} from "./liveChatItem";
import { AuthPage, LiveSelectionPage, MainAppPage } from "./mainAppPage";
import { LiveStatistics } from "./liveStatistics";
import { LiveLaunchProperties } from "./liveLaunchProperties";
import { Channel } from "./youtubeChannel";
import { YoutubeLive } from "./youtubeLive";
import { PariticipantPointRankings } from "./participantPoint";
import { NoEvent, OverlayEvent, PointInfoFromMainProcess } from "./overlay";
import { LiveSettings } from "./liveSettings";
import { AllGoalsStatus } from "./goals";
import { AppLog } from "./appLog";

/**
 * Ipc channel interfaces.
 *
 * key represents channel name.
 */
export interface IpcEvent {
  /**
   * Confirm to user that overlay feature should starts.
   */
  startOverlayWithUserConfirmation: (channel: Channel, live: YoutubeLive) => boolean;

  /**
   * Confirm to user that overlay feature should starts with video id.
   *
   * this ipc used for debug.
   */
  startOverlayWithUserConfirmationByVideoId: (inputVideoId: string) => boolean;

  /**
   * Start DataFetcheres.
   */
  startDataFetch: () => boolean;

  /**
   * Get UserSettings.
   *
   * if no settings then filled with default value.
   */
  getUserSettings: () => UserSettings;

  /**
   * Save userSettings to storage.
   *
   * if saving will be failed by some reasons, `false` will be returned.
   */
  saveUserSettings: (userSettings: UserSettings) => boolean;

  /**
   * Check existance of difference of user settings.
   */
  hasDifferenceAmongUserSettings: (settingsA: UserSettings, settingsB: UserSettings) => boolean;

  /**
   * Notify updated UserSettings to renderer.
   */
  tellUpdatedUserSettings: (settings: UserSettings) => void;

  /**
   * Notify all memberships and gifts item to renderer.
   */
  tellMembershipsAndGifts: (membershipsAndGifts: MembershipAndGiftItem[]) => void;

  /**
   * Add chat item to stock list.
   */
  addStock: (stock: ExtendedChatItemText) => boolean;

  /**
   * Remove the stock from list.
   */
  removeStock: (stock: ExtendedChatItemText) => boolean;

  /**
   * Notify LiveStatistics to renderer. (LCP & Overlay)
   */
  tellLiveStatistics: (statistics: LiveStatistics) => void;

  /**
   * Return MainAppPage for initial status.
   */
  getInitialMainAppPage: () => AuthPage | LiveSelectionPage;

  /**
   * Notify latest MainAppPage to renderer.
   */
  tellMainAppPage: (page: MainAppPage) => void;

  /**
   * transit MainAppPage status to "inLive".
   */
  startLive: (liveLaunchProperties: LiveLaunchProperties) => boolean;

  /**
   * transit MainAppPage status to "liveSelection"
   */
  quitLive: (liveLaunchProperties: LiveLaunchProperties) => boolean;

  /**
   * Update focus item.
   *
   * `undefined` means focused item will be unfocused.
   */
  updateFocus: (focus?: FocusedOnChatItem) => boolean;

  /**
   * Notify latest chat data.
   */
  tellChats: (chats: Chats) => void;

  /**
   * Start auth flow.
   */
  startAuthFlow: () => boolean;

  /**
   * Notify point rankings.
   */
  tellRankings: (rankings: PariticipantPointRankings) => void;

  /**
   * Add points manually.
   */
  manualPlusPoints: (item: TextMessageChat | SuperChat | SuperSticker) => boolean;

  /**
   * Notify amount of got point. (For Overlay)
   */
  tellAmountOfPoint: (item: PointInfoFromMainProcess) => void;

  /**
   * Notify LiveSettings. (For both Windows)
   */
  tellLiveSettings: (liveSettings: LiveSettings) => void;

  /**
   * Request to LiveManager that sync LiveSettings. (For Overlay)
   *
   * mainly used when overlay window created to fetch initial LiveSettings.
   */
  requestSyncLiveSettings: () => boolean;

  /**
   * Notify OverlayEvent (NoEvent is not included). (For Overlay)
   */
  tellOverlayEvent: (event: Exclude<OverlayEvent, NoEvent>) => void;

  /**
   * Notify AllGoalStatus.
   */
  tellAllGoalStatus: (status: AllGoalsStatus) => void;

  /**
   * Notify AppLog. (For Overlay)
   */
  tellAppLog: (appLog: AppLog) => void;
}
