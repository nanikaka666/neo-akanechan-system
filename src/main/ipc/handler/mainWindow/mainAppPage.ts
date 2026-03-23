import { yesNoDialogOnMainWindow } from "../../../dialog";
import {
  buildLiveLaunchProperties,
  buildLiveLaunchPropertiesForDebug,
} from "../../../liveLaunchProperties";
import { setupLiveManager, cleanupLiveManager } from "../../../liveManager";
import { MainAppPageSwitcher, getInitialMainAppPage } from "../../../mainAppPage";
import { getWindowManager } from "../../../window";
import { VideoId } from "../../../../types/youtubeDomainModel";
import { IpcMainWrapper } from "../../ipcMainWrapper";

export function setupIpcMainHandlersForMainAppPage() {
  IpcMainWrapper.handle("transitToLiveStandBy", (e, channel, live) => {
    const liveLaunchProperties = buildLiveLaunchProperties(channel, live);
    setupLiveManager(liveLaunchProperties);

    MainAppPageSwitcher.liveStandBy();
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("transitToLiveStandByByVideoId", async (e, inputVideoId) => {
    try {
      const liveLaunchProperties = await buildLiveLaunchPropertiesForDebug(
        new VideoId(inputVideoId),
      );

      setupLiveManager(liveLaunchProperties);

      MainAppPageSwitcher.liveStandBy();
      return true;
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e);
      } else {
        console.log(new Error(`Unknown error. ${e}`));
      }
      return false;
    }
  });

  IpcMainWrapper.handle("getInitialMainAppPage", async () => {
    return await getInitialMainAppPage();
  });

  IpcMainWrapper.handle("startLive", () => {
    MainAppPageSwitcher.liveControlPanel();

    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("quitLive", async (e, liveLaunchProperties) => {
    const res = await yesNoDialogOnMainWindow(
      `本当に終了しますか？`,
      liveLaunchProperties.live.title,
    );
    if (!res) {
      return false;
    }

    // clean up emitters
    cleanupLiveManager();

    getWindowManager().closeOverlayWindow();

    MainAppPageSwitcher.liveSelection();

    return true;
  });
}
