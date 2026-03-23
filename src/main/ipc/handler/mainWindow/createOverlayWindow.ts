import { getLiveManager } from "../../../liveManager";
import { getWindowManager } from "../../../window";
import { IpcMainWrapper } from "../../ipcMainWrapper";

export function setupIpcMainHandlersForCreateOverlayWindow() {
  IpcMainWrapper.handle("createOverlayWindow", () => {
    if (getWindowManager().getOverlayWindow() !== undefined) {
      return Promise.resolve(true);
    }

    getWindowManager().createOverlayWindow(
      getLiveManager().getLiveLaunchProperties().overlayWindowTitle,
    );
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("createOverlayWindowForPreview", () => {
    if (getWindowManager().getOverlayWindow() !== undefined) {
      return Promise.resolve(true);
    }

    getWindowManager().createOverlayWindowInPreview(
      getLiveManager().getLiveLaunchProperties().overlayWindowTitle,
    );
    return Promise.resolve(true);
  });
}
