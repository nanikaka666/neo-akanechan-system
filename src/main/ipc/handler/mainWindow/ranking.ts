import { getLiveManager } from "../../../liveManager";
import { IpcMainWrapper } from "../../ipcMainWrapper";

export function setupIpcMainHandlersForRanking() {
  IpcMainWrapper.handle("showRanking", (_, ranking) => {
    getLiveManager().actionShowRanking(ranking);
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("hideRanking", () => {
    getLiveManager().actionHideRanking();
    return Promise.resolve(true);
  });
}
