import { setupIpcMainHandlersForMainAppPage } from "./mainAppPage";
import { setupIpcMainHandlersForAuth } from "./auth";
import { setupIpcMainHandlersForCommentViewer } from "./commentViewer";
import { setupIpcMainHandlersForCompetition } from "./competition";
import { setupIpcMainHandlersForRanking } from "./ranking";
import { setupIpcMainHandlersForUserSettings } from "./userSettings";

export function setupIpcMainHandlersForMainWindow() {
  setupIpcMainHandlersForAuth();
  setupIpcMainHandlersForCommentViewer();
  setupIpcMainHandlersForCompetition();
  setupIpcMainHandlersForRanking();
  setupIpcMainHandlersForUserSettings();
  setupIpcMainHandlersForMainAppPage();
}
