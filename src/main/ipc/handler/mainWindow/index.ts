import { setupIpcMainHandlersForAuth } from "./auth";
import { setupIpcMainHandlersForCommentViewer } from "./commentViewer";
import { setupIpcMainHandlersForCompetition } from "./competition";

export function setupIpcMainHandlersForMainWindow() {
  setupIpcMainHandlersForAuth();
  setupIpcMainHandlersForCommentViewer();
  setupIpcMainHandlersForCompetition();
}
