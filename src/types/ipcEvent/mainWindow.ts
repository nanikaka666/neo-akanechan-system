import { OptionLabel } from "../competition";
import { AllGoalsStatus } from "../goals";
import {
  MembershipAndGiftItem,
  ExtendedChatItemText,
  FocusedOnChatItem,
  Chats,
} from "../liveChatItem";
import { LiveLaunchProperties } from "../liveLaunchProperties";
import { AuthPage, LiveSelectionPage, MainAppPage } from "../mainAppPage";
import { PariticipantPointRankings } from "../participantPoint";
import { UserSettings } from "../userSettings";
import { Channel } from "../youtubeChannel";
import { YoutubeLive } from "../youtubeLive";

export type IpcEventForMainWindow = IpcEventOthers &
  AuthIpcEvent &
  UserSettingsIpcEvent &
  RankingIpcEvent &
  CompetitionIpcEvent &
  CommentViewerIpcEvent &
  GoalIpcEvent &
  MainAppPageIpcEvent &
  CreateOverlayWindowIpcEvent;

interface AuthIpcEvent {
  /**
   * Start auth flow.
   */
  startAuthFlow: () => boolean;

  /**
   * Request OAuth revocation.
   */
  accountDisconnect: () => boolean;
}

interface UserSettingsIpcEvent {
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
}

interface RankingIpcEvent {
  /**
   * Notify point rankings.
   */
  tellRankings: (rankings: PariticipantPointRankings) => void;

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
}

interface CompetitionIpcEvent {
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
}

interface CommentViewerIpcEvent {
  /**
   * Notify latest chat data.
   */
  tellChats: (chats: Chats) => void;

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
   * Update focus item.
   *
   * `undefined` means focused item will be unfocused.
   */
  updateFocus: (focus?: FocusedOnChatItem) => boolean;
}

interface GoalIpcEvent {
  /**
   * Notify AllGoalStatus.
   */
  tellAllGoalStatus: (status: AllGoalsStatus) => void;
}

interface MainAppPageIpcEvent {
  /**
   * Return MainAppPage for initial status.
   */
  getInitialMainAppPage: () => AuthPage | LiveSelectionPage;

  /**
   * Notify latest MainAppPage to renderer.
   */
  tellMainAppPage: (page: MainAppPage) => void;

  /**
   * transit MainAppPage status to "liveStandBy"
   */
  transitToLiveStandBy: (channel: Channel, live: YoutubeLive) => boolean;

  /**
   * transit MainAppPage status to "liveStandBy" with video id. (For debug)
   */
  transitToLiveStandByByVideoId: (inputVideoId: string) => boolean;

  /**
   * transit MainAppPage status to "inLive".
   */
  startLive: () => boolean;

  /**
   * transit MainAppPage status to "liveSelection"
   */
  quitLive: (liveLaunchProperties: LiveLaunchProperties) => boolean;
}

interface CreateOverlayWindowIpcEvent {
  /**
   * Create Overlay Window.
   */
  createOverlayWindow: () => boolean;

  /**
   * Create Overlay Window for preview.
   */
  createOverlayWindowForPreview: () => boolean;
}

interface IpcEventOthers {
  /**
   * Start DataFetcheres.
   */
  startDataFetch: () => boolean;

  /**
   * Request to LiveManager to get LiveLaunchProperties.
   */
  getLiveLaunchProperties: () => LiveLaunchProperties;
}
