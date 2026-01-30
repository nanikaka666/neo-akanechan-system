import { BrowserWindow } from "electron";
import { isDevMode } from "./environment";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

/**
 * Handling Electron app Window instances.
 */
export class WindowManager {
  #mainWindowId?: number;
  #overlayWindowId?: number;
  constructor() {}

  createMainWindow() {
    // if Main Window already exists, then do nothing.
    if (this.#checkMainWindowExistence()) {
      return;
    }
    const mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        devTools: isDevMode(),
      },
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // mainWindow.webContents.openDevTools();
    this.#mainWindowId = mainWindow.id;
  }

  #checkMainWindowExistence() {
    if (this.#mainWindowId === undefined) {
      return false;
    }
    return BrowserWindow.fromId(this.#mainWindowId) !== null;
  }
}

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
