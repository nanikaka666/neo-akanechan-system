import { getWindowManager } from "../../../window";
import { IpcMainWrapper } from "../../ipcMainWrapper";

export function setupIpcMainHandlersForCreateOverlayWindow() {
  IpcMainWrapper.handle("createOverlayWindow", (e, overlayWindowTitle) => {
    if (getWindowManager().getOverlayWindow() !== undefined) {
      return Promise.resolve(true);
    }

    getWindowManager().createOverlayWindow(overlayWindowTitle, false);
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("createOverlayWindowForPreview", (e, overlayWindowTitle) => {
    if (getWindowManager().getOverlayWindow() !== undefined) {
      return Promise.resolve(true);
    }

    getWindowManager().createOverlayWindow(overlayWindowTitle, true);
    return Promise.resolve(true);
  });
}
