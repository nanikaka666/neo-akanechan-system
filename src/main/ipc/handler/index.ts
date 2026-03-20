import { IpcMainWrapper } from "../ipcMainWrapper";
import { getLiveManager } from "../../liveManager";
import { setupIpcMainHandlersForCommon } from "./common";
import { setupIpcMainHandlersForMainWindow } from "./mainWindow";

export function setupIpcMainHandlers() {
  setupIpcMainHandlersForMainWindow();
  setupIpcMainHandlersForCommon();

  IpcMainWrapper.handle("startDataFetch", async () => {
    await getLiveManager().start();
    return true;
  });

  IpcMainWrapper.handle("getLiveLaunchProperties", () => {
    return Promise.resolve(getLiveManager().getLiveLaunchProperties());
  });
}
