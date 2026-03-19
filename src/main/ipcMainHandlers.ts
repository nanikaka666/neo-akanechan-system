import { IpcMainWrapper } from "./ipcMainWrapper";
import { WebContentsWrapper } from "./webContentsWrapper";
import { UserSettingsService } from "./userSettings";
import { doAuthFlow, isUserAuthorized, revokeCredentials } from "./auth/google";
import {
  buildLiveLaunchProperties,
  buildLiveLaunchPropertiesForDebug,
} from "./liveLaunchProperties";
import { VideoId } from "../types/youtubeDomainModel";
import {
  cleanupLiveManager,
  getLiveManager,
  isExistLiveManager,
  setupLiveManager,
} from "./liveManager";
import { getWindowManager } from "./window";
import { yesNoDialogOnMainWindow } from "./dialog";
import { getInitialMainAppPage, MainAppPageSwitcher } from "./mainAppPage";

export function setupIpcMainHandlers() {
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

  IpcMainWrapper.handle("getUserSettings", () => {
    return Promise.resolve(UserSettingsService.getUserSettings());
  });

  IpcMainWrapper.handle("saveUserSettings", (e, userSettings) => {
    try {
      UserSettingsService.setUserSettings(userSettings);
      WebContentsWrapper.send(e.sender, "tellUpdatedUserSettings", userSettings);

      // if LiveManager is up (it means user is in LiveStandBy page) then notify it to LiveManager.
      if (isExistLiveManager()) {
        getLiveManager().updateLiveSettings();
      }

      return Promise.resolve(true);
    } catch (e: unknown) {
      console.log(e);
      return Promise.resolve(false);
    }
  });

  IpcMainWrapper.handle("hasDifferenceAmongUserSettings", (e, settingsA, settingsB) => {
    return Promise.resolve(!UserSettingsService.isEqual(settingsA, settingsB));
  });

  IpcMainWrapper.handle("startDataFetch", async () => {
    await getLiveManager().start();
    return true;
  });

  IpcMainWrapper.handle("addStock", (e, item) => {
    getLiveManager().actionAddStock(item);
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("removeStock", (e, item) => {
    getLiveManager().actionRemoveStock(item);
    return Promise.resolve(true);
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

  IpcMainWrapper.handle("updateFocus", (e, focus) => {
    if (focus) {
      getLiveManager().actionSetFocus(focus);
    } else {
      getLiveManager().actionUnsetFocus();
    }
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("startAuthFlow", async () => {
    const authFlowResult = await doAuthFlow();

    if (!authFlowResult) {
      return false;
    }

    MainAppPageSwitcher.liveSelection();

    return true;
  });

  IpcMainWrapper.handle("requestSyncLiveSettings", () => {
    getLiveManager().syncLiveSettings();
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("showRanking", (_, ranking) => {
    getLiveManager().actionShowRanking(ranking);
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("hideRanking", () => {
    getLiveManager().actionHideRanking();
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("openCompetition", (_, question, options, acceptTimeMinutes) => {
    getLiveManager().actionOpenCompetition(question, options, acceptTimeMinutes);
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("abortCompetition", async () => {
    const res = await yesNoDialogOnMainWindow(`本当にコンペを終了しますか？`);
    if (!res) {
      return false;
    }
    getLiveManager().actionAbortCompetition();
    return true;
  });

  IpcMainWrapper.handle("answerDecision", async (_, answer, optionStr) => {
    const res = await yesNoDialogOnMainWindow(
      `コンペの正解を確定します`,
      `${answer}: ${optionStr}`,
    );
    if (!res) {
      return false;
    }
    getLiveManager().actionAnswerDecision(answer);
    return true;
  });

  IpcMainWrapper.handle("manuallyEntryClose", async () => {
    const res = await yesNoDialogOnMainWindow(`コンペの参加を締め切ります`);
    if (!res) {
      return false;
    }
    getLiveManager().actionManuallyEntryClose();
    return true;
  });

  IpcMainWrapper.handle("getLiveLaunchProperties", () => {
    return Promise.resolve(getLiveManager().getLiveLaunchProperties());
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
