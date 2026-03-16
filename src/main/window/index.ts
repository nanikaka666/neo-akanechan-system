import { WindowManager } from "./window";

let windowManager: WindowManager | undefined;

export function setupWindowManager() {
  windowManager = new WindowManager();
}

export function getWindowManager() {
  if (windowManager === undefined) {
    throw new Error("WindowManager is not setup.");
  }
  return windowManager;
}
