import { yesNoDialogOnMainWindow } from "../../../dialog";
import { doAuthFlow, isUserAuthorized, revokeCredentials } from "../../../auth/google";
import { MainAppPageSwitcher } from "../../../mainAppPage";
import { IpcMainWrapper } from "../../ipcMainWrapper";

export function setupIpcMainHandlersForAuth() {
  IpcMainWrapper.handle("startAuthFlow", async () => {
    const authFlowResult = await doAuthFlow();

    if (!authFlowResult) {
      return false;
    }

    MainAppPageSwitcher.liveSelection();

    return true;
  });

  IpcMainWrapper.handle("accountDisconnect", async () => {
    if (!isUserAuthorized()) {
      return true;
    }

    const res = await yesNoDialogOnMainWindow(`Youtubeアカウントの連携を解除します`);
    if (!res) {
      return false;
    }

    try {
      await revokeCredentials();
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e.message);
      } else {
        console.log(e);
      }
    }

    if (!isUserAuthorized()) {
      MainAppPageSwitcher.auth();
      return true;
    }

    return false;
  });
}
