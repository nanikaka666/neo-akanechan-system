import { BrowserWindow } from "electron";
import { isDevMode } from "../environment";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const OVERLAY_WEBPACK_ENTRY: string;
declare const OVERLAY_PRELOAD_WEBPACK_ENTRY: string;

/**
 * Handling Electron app Window instances.
 */
export class WindowManager {
  #mainWindowId?: number;
  #overlayWindowId?: number;
  constructor() {}

  /**
   * Create main window.
   *
   * if Main Window already exists, then do nothing.
   */
  createMainWindow() {
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

  getMainWindow() {
    if (!this.#checkMainWindowExistence()) {
      return undefined;
    }
    return BrowserWindow.fromId(this.#mainWindowId!)!;
  }

  /**
   * Returns WebContents of main window.
   *
   * if main window closed then returns `undefined`.
   */
  getMainWindowWebContents() {
    const maybeMainWindow = this.getMainWindow();
    if (maybeMainWindow === undefined) {
      return undefined;
    }
    return maybeMainWindow.webContents;
  }

  getOverlayWindow() {
    if (!this.#checkOverlayWindowExistence()) {
      return undefined;
    }
    return BrowserWindow.fromId(this.#overlayWindowId!)!;
  }

  /**
   * Returns WebContents of overlay window.
   *
   * if main window closed then returns `undefined`.
   */
  getOverlayWindowWebContents() {
    const maybeOverlayWindow = this.getOverlayWindow();
    if (!maybeOverlayWindow) {
      return undefined;
    }
    return maybeOverlayWindow.webContents;
  }

  createOverlayWindow(title: string) {
    // if overlay window exists, then do nothing.
    if (this.#checkOverlayWindowExistence()) {
      return;
    }
    // if main window does not exist, then do nothing.
    if (!this.#checkMainWindowExistence()) {
      return;
    }
    const overlayWindow = new BrowserWindow({
      title: title,
      useContentSize: true,
      height: 720,
      width: 1280,
      // transparent: true,
      // titleBarStyle: "hidden",
      webPreferences: {
        preload: OVERLAY_PRELOAD_WEBPACK_ENTRY,
        devTools: isDevMode(),
        backgroundThrottling: false,
      },
    });

    overlayWindow.loadURL(OVERLAY_WEBPACK_ENTRY);

    // mainWindow.webContents.openDevTools();
    this.#overlayWindowId = overlayWindow.id;
  }

  closeOverlayWindow() {
    const maybeOverlayWindow = this.getOverlayWindow();
    if (maybeOverlayWindow === undefined) {
      return;
    }
    maybeOverlayWindow.close();
  }

  /**
   * Returns whether no window shows.
   */
  isAllWindowClosed() {
    return BrowserWindow.getAllWindows().length === 0;
  }

  #checkMainWindowExistence() {
    if (this.#mainWindowId === undefined) {
      return false;
    }
    return BrowserWindow.fromId(this.#mainWindowId) !== null;
  }

  #checkOverlayWindowExistence() {
    if (this.#overlayWindowId === undefined) {
      return false;
    }
    return BrowserWindow.fromId(this.#overlayWindowId) !== null;
  }
}
