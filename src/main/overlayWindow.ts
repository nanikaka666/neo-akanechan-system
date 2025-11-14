import { BrowserWindow } from "electron";

declare const OVERLAY_WEBPACK_ENTRY: string;
declare const OVERLAY_PRELOAD_WEBPACK_ENTRY: string;

export const createOverlayWindow = (): void => {
  const parent = BrowserWindow.getFocusedWindow();
  if (parent === null) {
    return;
  }
  const overlayWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: OVERLAY_PRELOAD_WEBPACK_ENTRY,
    },
  });

  overlayWindow.loadURL(OVERLAY_WEBPACK_ENTRY);

  // mainWindow.webContents.openDevTools();
};
