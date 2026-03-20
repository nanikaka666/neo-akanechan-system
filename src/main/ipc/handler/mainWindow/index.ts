import { setupIpcMainHandlersForAuth } from "./auth";

export function setupIpcMainHandlersForMainWindow() {
  setupIpcMainHandlersForAuth();
}
