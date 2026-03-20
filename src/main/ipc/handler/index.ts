import { IpcMainWrapper } from "../ipcMainWrapper";
import {
  buildLiveLaunchProperties,
  buildLiveLaunchPropertiesForDebug,
} from "../../liveLaunchProperties";
import { VideoId } from "../../../types/youtubeDomainModel";
import { cleanupLiveManager, getLiveManager, setupLiveManager } from "../../liveManager";
import { getWindowManager } from "../../window";
import { yesNoDialogOnMainWindow } from "../../dialog";
import { getInitialMainAppPage, MainAppPageSwitcher } from "../../mainAppPage";
import { setupIpcMainHandlersForCommon } from "./common";
import { setupIpcMainHandlersForMainWindow } from "./mainWindow";

export function setupIpcMainHandlers() {
  setupIpcMainHandlersForMainWindow();
  setupIpcMainHandlersForCommon();

  IpcMainWrapper.handle("startOverlayWithUserConfirmation", async (e, channel, live) => {
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
    getWindowManager().createOverlayWindow(liveLaunchProperties.overlayWindowTitle);

    MainAppPageSwitcher.liveStandBy();
    return true;
  });

  IpcMainWrapper.handle("startOverlayWithUserConfirmationByVideoId", async (e, inputVideoId) => {
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
      getWindowManager().createOverlayWindow(liveLaunchProperties.overlayWindowTitle);

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

  IpcMainWrapper.handle("startDataFetch", async () => {
    await getLiveManager().start();
    return true;
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

  IpcMainWrapper.handle("getLiveLaunchProperties", () => {
    return Promise.resolve(getLiveManager().getLiveLaunchProperties());
  });
}
