import { getWindowManager } from "../../../window";
import { IpcMainWrapper } from "../../ipcMainWrapper";

export function setupIpcMainHandlersForCreateOverlayWindow() {
  IpcMainWrapper.handle("createOverlayWindow", (e, overlayWindowTitle) => {
    if (getWindowManager().getOverlayWindow() !== undefined) {
      return Promise.resolve(true);
    }

    getWindowManager().createOverlayWindow(overlayWindowTitle);
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("createOverlayWindowForPreview", (e, overlayWindowTitle) => {
    if (getWindowManager().getOverlayWindow() !== undefined) {
      return Promise.resolve(true);
    }

    getWindowManager().createOverlayWindowInPreview(overlayWindowTitle);
    return Promise.resolve(true);
  });
}
