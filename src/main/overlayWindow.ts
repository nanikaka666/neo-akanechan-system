import { BrowserWindow } from "electron";
import { isDevMode } from "./environment";

declare const OVERLAY_WEBPACK_ENTRY: string;
declare const OVERLAY_PRELOAD_WEBPACK_ENTRY: string;

export const createOverlayWindow = (title: string): void => {
  const parent = BrowserWindow.getFocusedWindow();
  if (parent === null) {
    return;
  }
  const overlayWindow = new BrowserWindow({
    title: title,
    height: 720,
    width: 1080,
    webPreferences: {
      preload: OVERLAY_PRELOAD_WEBPACK_ENTRY,
      devTools: isDevMode(),
    },
  });

  overlayWindow.loadURL(OVERLAY_WEBPACK_ENTRY);

  // mainWindow.webContents.openDevTools();
};
