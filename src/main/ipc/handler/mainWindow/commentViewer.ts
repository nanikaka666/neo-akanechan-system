import { getLiveManager } from "../../../liveManager";
import { IpcMainWrapper } from "../../ipcMainWrapper";

export function setupIpcMainHandlersForCommentViewer() {
  IpcMainWrapper.handle("addStock", (e, item) => {
    getLiveManager().actionAddStock(item);
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("removeStock", (e, item) => {
    getLiveManager().actionRemoveStock(item);
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("updateFocus", (e, focus) => {
    if (focus) {
      getLiveManager().actionSetFocus(focus);
    } else {
      getLiveManager().actionUnsetFocus();
    }
    return Promise.resolve(true);
  });
}
