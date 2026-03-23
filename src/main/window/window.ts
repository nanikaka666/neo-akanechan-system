import { BrowserWindow, BrowserWindowConstructorOptions, screen } from "electron";
import { isDevMode } from "../environment";
import { getStorageService } from "../storage";
import { getWindowManager } from ".";
import { WebContentsWrapper } from "../webContentsWrapper";
import { yesNoDialogOnMainWindow } from "../dialog";
import { getLiveManager, isExistLiveManager } from "../liveManager";

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
  #mainWindowMovedTimer?: NodeJS.Timeout;
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

    mainWindow.on("resized", () => {
      getStorageService().registerMainWindowBounds(mainWindow.getBounds());
    });

    mainWindow.on("moved", () => {
      // debounce moved event
      if (this.#mainWindowMovedTimer) {
        clearTimeout(this.#mainWindowMovedTimer);
        this.#mainWindowMovedTimer = undefined;
      }
      this.#mainWindowMovedTimer = setTimeout(() => {
        getStorageService().registerMainWindowBounds(mainWindow.getBounds());
        this.#mainWindowMovedTimer = undefined;
      }, 500);
    });

    const maybeBounds = getStorageService().getMainWindowBounds();
    if (maybeBounds) {
      mainWindow.setBounds(maybeBounds);
    }

    mainWindow.on("close", async (e) => {
      e.preventDefault();

      // show confirm dialog when LiveManager is alive. other wise the window is closed without confirmation.
      if (!isExistLiveManager()) {
        mainWindow.destroy();
      } else {
        const res = await yesNoDialogOnMainWindow("本当にアプリを終了しますか？");
        if (res) {
          getLiveManager().close();
          mainWindow.destroy();
        }
      }
    });

    mainWindow.on("closed", () => {
      // if main window closed, then overlay window will be closed at same time.
      getWindowManager().closeOverlayWindow();
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

    const overlayWindow = new BrowserWindow(this.#getOverlayWindowOptions(title));

    const limitationBounds = this.#getLimitationBoundsOfAllDisplays();
    overlayWindow.setPosition(0, limitationBounds.y);

    overlayWindow.on("closed", () => {
      const mainWindowWebContents = getWindowManager().getMainWindowWebContents();
      if (mainWindowWebContents === undefined) {
        return;
      }
      WebContentsWrapper.send(mainWindowWebContents, "tellOverlayWindowClosed");
    });

    overlayWindow.loadURL(OVERLAY_WEBPACK_ENTRY);

    this.#overlayWindowId = overlayWindow.id;
  }

  createOverlayWindowInPreview(title: string) {
    // if overlay window exists, then do nothing.
    if (this.#checkOverlayWindowExistence()) {
      return;
    }
    // if main window does not exist, then do nothing.
    if (!this.#checkMainWindowExistence()) {
      return;
    }

    const overlayWindow = new BrowserWindow(this.#getOverlayWindowOptionsForPreview(title));

    const limitationBounds = this.#getLimitationBoundsOfAllDisplays();

    overlayWindow.setPosition(0, limitationBounds.y - 720 - 30);
    overlayWindow.setBackgroundColor("green");

    overlayWindow.on("closed", () => {
      const mainWindowWebContents = getWindowManager().getMainWindowWebContents();
      if (mainWindowWebContents === undefined) {
        return;
      }
      WebContentsWrapper.send(mainWindowWebContents, "tellOverlayWindowClosed");
    });

    overlayWindow.loadURL(OVERLAY_WEBPACK_ENTRY);

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

  #getLimitationBoundsOfAllDisplays() {
    const maximum = { x: 0, y: 0 };
    screen.getAllDisplays().forEach((display) => {
      maximum.x = Math.max(maximum.x, display.bounds.x + display.bounds.width);
      maximum.y = Math.max(maximum.y, display.bounds.y + display.bounds.height);
    });
    return maximum;
  }

  #getOverlayWindowOptions(title: string): BrowserWindowConstructorOptions {
    return {
      ...this.#getOverlayWindowOptionsForPreview(title),
      ...{
        transparent: true,
        titleBarStyle: "hidden",
      },
    };
  }

  #getOverlayWindowOptionsForPreview(title: string): BrowserWindowConstructorOptions {
    return {
      title: title,
      useContentSize: true,
      height: 720,
      width: 1280,
      webPreferences: {
        preload: OVERLAY_PRELOAD_WEBPACK_ENTRY,
        devTools: isDevMode(),
        backgroundThrottling: false,
      },
    };
  }
}
