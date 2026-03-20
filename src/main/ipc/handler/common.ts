import { getLiveManager } from "../../liveManager";
import { IpcMainWrapper } from "../ipcMainWrapper";

export function setupIpcMainHandlersForCommon() {
  IpcMainWrapper.handle("requestSyncLiveSettings", () => {
    getLiveManager().syncLiveSettings();
    return Promise.resolve(true);
  });
}
