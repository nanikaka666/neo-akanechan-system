import { ChatLog } from "../chatLog";
import { FocusViewItem } from "../focusView";
import { PointInfoFromMainProcess, OverlayEvent, NoEvent } from "../overlay";
import { PariticipantPointRankings } from "../participantPoint";

export interface IpcEventForOverlay {
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
