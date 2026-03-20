import { UserSettings } from "./userSettings";
import {
  Chats,
  ExtendedChatItemText,
  FocusedOnChatItem,
  MembershipAndGiftItem,
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
import { ChatLog } from "./chatLog";
import { FocusViewItem } from "./focusView";
import { CompetitionStatus, OptionLabel } from "./competition";

/**
 * Ipc channel interfaces.
 *
 * key represents channel name.
 */
export type IpcEvent = IpcEventForMainWindow & IpcEventForOverlay & CommonIpcEvent;

interface IpcEventForMainWindow {
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
  startLive: () => boolean;

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
   * Notify AllGoalStatus.
   */
  tellAllGoalStatus: (status: AllGoalsStatus) => void;

  /**
   * Request to LiveManager to show ranking dialogs on overlay.
   */
  showRanking: (ranking: PariticipantPointRankings) => boolean;

  /**
   * Notify flag whether a ranking is shown or not.
   */
  tellIsShownRanking: (isShown: boolean) => void;

  /**
   * Request to LiveManager to hide ranking dialogs on overlay.
   */
  hideRanking: () => boolean;

  /**
   * Request to LiveManager to open a new competition.
   */
  openCompetition: (question: string, options: string[], acceptTimeMinutes: number) => boolean;

  /**
   * Request to LiveManager to abort the competition.
   */
  abortCompetition: () => boolean;

  /**
   * Request to LiveManager to decide the answer of competition.
   */
  answerDecision: (answer: OptionLabel, optionStr: string) => boolean;

  /**
   * Request to LiveManager to close bet action.
   */
  manuallyEntryClose: () => boolean;

  /**
   * Request to LiveManager to get LiveLaunchProperties.
   */
  getLiveLaunchProperties: () => LiveLaunchProperties;

  /**
   * Request OAuth revocation.
   */
  accountDisconnect: () => boolean;
}

interface CommonIpcEvent {
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

interface IpcEventForOverlay {
  /**
   * Notify amount of got point.
   */
  tellAmountOfPoint: (item: PointInfoFromMainProcess) => void;

  /**
   * Notify OverlayEvent (NoEvent is not included).
   */
  tellOverlayEvent: (event: Exclude<OverlayEvent, NoEvent>) => void;

  /**
   * Notify ChatLog.
   */
  tellChatLog: (chatLog: ChatLog) => void;

  /**
   * Notify FocusViewItem.
   */
  tellFocusViewItem: (item: FocusViewItem | undefined) => void;

  /**
   * Notify to show rankings.
   */
  tellRankingView: (ranking: PariticipantPointRankings | undefined) => void;
}
