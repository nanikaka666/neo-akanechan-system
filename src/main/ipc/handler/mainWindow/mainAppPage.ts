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
  IpcMainWrapper.handle("transitToLiveStandBy", async (e, channel, live) => {
    if (getWindowManager().getOverlayWindow() !== undefined) {
      // already overlay window opened.
      return false;
    }

    const res = await yesNoDialogOnMainWindow(`ライブ配信を開始しますか？`, live.title);
    if (!res) {
      return false;
    }

    const liveLaunchProperties = buildLiveLaunchProperties(channel, live);

    setupLiveManager(liveLaunchProperties);
    getWindowManager().createOverlayWindow(liveLaunchProperties.overlayWindowTitle, false);

    MainAppPageSwitcher.liveStandBy();
    return true;
  });

  IpcMainWrapper.handle("transitToLiveStandByByVideoId", async (e, inputVideoId) => {
    if (getWindowManager().getOverlayWindow() !== undefined) {
      // already overlay window opened.
      return false;
    }

    try {
      const liveLaunchProperties = await buildLiveLaunchPropertiesForDebug(
        new VideoId(inputVideoId),
      );
      const res = await yesNoDialogOnMainWindow(
        `ライブ配信を開始しますか？`,
        liveLaunchProperties.live.title,
      );
      if (!res) {
        return false;
      }

      setupLiveManager(liveLaunchProperties);
      getWindowManager().createOverlayWindow(liveLaunchProperties.overlayWindowTitle, false);

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
