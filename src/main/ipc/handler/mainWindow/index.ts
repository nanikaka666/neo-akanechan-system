import { setupIpcMainHandlersForAuth } from "./auth";
import { setupIpcMainHandlersForCommentViewer } from "./commentViewer";

export function setupIpcMainHandlersForMainWindow() {
  setupIpcMainHandlersForAuth();
  setupIpcMainHandlersForCommentViewer();
}
