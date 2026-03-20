import { setupIpcMainHandlersForAuth } from "./auth";
import { setupIpcMainHandlersForCommentViewer } from "./commentViewer";
import { setupIpcMainHandlersForCompetition } from "./competition";
import { setupIpcMainHandlersForRanking } from "./ranking";

export function setupIpcMainHandlersForMainWindow() {
  setupIpcMainHandlersForAuth();
  setupIpcMainHandlersForCommentViewer();
  setupIpcMainHandlersForCompetition();
  setupIpcMainHandlersForRanking();
}
