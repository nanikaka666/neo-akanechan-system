import { IpcMainWrapper } from "./ipcMainWrapper";
import { WebContentsWrapper } from "./webContentsWrapper";
import { BrowserWindow, dialog } from "electron";
import { UserSettingsService } from "./userSettings";
import { AuthPage, LiveControlPanelPage, LiveSelectionPage } from "../types/mainAppPage";
import { doAuthFlow, isUserAuthorized } from "./auth/google";
import { YoutubeApiService } from "./youtubeApi/service";
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

export function setupIpcMainHandlers() {
  IpcMainWrapper.handle("startOverlayWithUserConfirmation", async (_, channel, live) => {
    if (getWindowManager().getOverlayWindow() !== undefined) {
      // already overlay window opened.
      return Promise.resolve(false);
    }
    const mainWindow = getWindowManager().getMainWindow();
    if (mainWindow === undefined) {
      return Promise.resolve(false);
    }
    const res = await dialog.showMessageBox(mainWindow, {
      message: `ライブ配信を開始しますか？`,
      type: "question",
      buttons: ["OK", "NO"],
      defaultId: 0,
      detail: `${live.title}`,
    });
    if (res.response !== 0) {
      return Promise.resolve(false);
    }

    const liveLaunchProperties = buildLiveLaunchProperties(channel, live);

    setupLiveManager(liveLaunchProperties);
    getWindowManager().createOverlayWindow(liveLaunchProperties.overlayWindowTitle);

    WebContentsWrapper.send(mainWindow.webContents, "tellMainAppPage", {
      type: "liveStandBy",
    });
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("startOverlayWithUserConfirmationByVideoId", async (_, inputVideoId) => {
    if (getWindowManager().getOverlayWindow() !== undefined) {
      // already overlay window opened.
      return false;
    }
    const mainWindow = getWindowManager().getMainWindow();
    if (mainWindow === undefined) {
      return false;
    }

    try {
      const liveLaunchProperties = await buildLiveLaunchPropertiesForDebug(
        new VideoId(inputVideoId),
      );
      const res = await dialog.showMessageBox(mainWindow, {
        message: `ライブ配信を開始しますか？`,
        type: "question",
        buttons: ["OK", "NO"],
        defaultId: 0,
        detail: `${liveLaunchProperties.live.title}`,
      });
      if (res.response !== 0) {
        return false;
      }

      setupLiveManager(liveLaunchProperties);
      getWindowManager().createOverlayWindow(liveLaunchProperties.overlayWindowTitle);

      WebContentsWrapper.send(mainWindow.webContents, "tellMainAppPage", {
        type: "liveStandBy",
      });
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
    if (!isUserAuthorized()) {
      return Promise.resolve({ type: "auth" } satisfies AuthPage);
    }

    const maybeChannel = await YoutubeApiService.getChannelOfMine();

    if (!maybeChannel) {
      dialog.showErrorBox(
        "Please OAuth flow again",
        "Youtube Channel associated with oauth accound is not found.",
      );
      return Promise.resolve({ type: "auth" } satisfies AuthPage);
    }

    return Promise.resolve({
      type: "liveSelection",
      channel: maybeChannel,
      lives: await YoutubeApiService.getNotFinishedLivesOfMine(),
    } satisfies LiveSelectionPage);
  });

  IpcMainWrapper.handle("startLive", (e) => {
    WebContentsWrapper.send(e.sender, "tellMainAppPage", {
      type: "liveControlPanel",
    } satisfies LiveControlPanelPage);

    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("quitLive", async (e, liveLaunchProperties) => {
    const window = BrowserWindow.fromWebContents(e.sender);
    if (window === null) {
      return false;
    }
    const res = await dialog.showMessageBox(window, {
      message: `本当に終了しますか？`,
      type: "question",
      buttons: ["OK", "NO"],
      defaultId: 0,
      detail: `${liveLaunchProperties.live.title}`,
    });
    if (res.response !== 0) {
      return false;
    }

    // clean up emitters
    cleanupLiveManager();

    const channel = await YoutubeApiService.getChannelOfMine();
    if (!channel) {
      WebContentsWrapper.send(e.sender, "tellMainAppPage", {
        type: "auth",
      } satisfies AuthPage);
    } else {
      WebContentsWrapper.send(e.sender, "tellMainAppPage", {
        type: "liveSelection",
        channel: channel,
        lives: await YoutubeApiService.getNotFinishedLivesOfMine(),
      } satisfies LiveSelectionPage);
    }

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

  IpcMainWrapper.handle("startAuthFlow", async (e) => {
    const authFlowResult = await doAuthFlow();

    if (!authFlowResult) {
      return false;
    }

    const maybeChannel = await YoutubeApiService.getChannelOfMine();

    if (!maybeChannel) {
      dialog.showErrorBox(
        "Please OAuth flow again",
        "Youtube Channel associated with oauth accound is not found.",
      );
      return false;
    }

    WebContentsWrapper.send(e.sender, "tellMainAppPage", {
      type: "liveSelection",
      channel: maybeChannel,
      lives: await YoutubeApiService.getNotFinishedLivesOfMine(),
    });
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

  IpcMainWrapper.handle("abortCompetition", async (e) => {
    const window = BrowserWindow.fromWebContents(e.sender);
    if (window === null) {
      return false;
    }
    const res = await dialog.showMessageBox(window, {
      message: `本当にコンペを終了しますか？`,
      type: "question",
      buttons: ["OK", "NO"],
      defaultId: 0,
    });
    if (res.response !== 0) {
      return false;
    }
    getLiveManager().actionAbortCompetition();
    return true;
  });

  IpcMainWrapper.handle("answerDecision", async (e, answer, optionStr) => {
    const window = BrowserWindow.fromWebContents(e.sender);
    if (window === null) {
      return false;
    }
    const res = await dialog.showMessageBox(window, {
      message: `コンペの正解を確定します`,
      type: "question",
      buttons: ["OK", "NO"],
      defaultId: 0,
      detail: `${answer}: ${optionStr}`,
    });
    if (res.response !== 0) {
      return false;
    }
    getLiveManager().actionAnswerDecision(answer);
    return true;
  });

  IpcMainWrapper.handle("manuallyEntryClose", async (e) => {
    const window = BrowserWindow.fromWebContents(e.sender);
    if (window === null) {
      return false;
    }
    const res = await dialog.showMessageBox(window, {
      message: `コンペの参加を締め切ります`,
      type: "question",
      buttons: ["OK", "NO"],
      defaultId: 0,
    });
    if (res.response !== 0) {
      return false;
    }
    getLiveManager().actionManuallyEntryClose();
    return true;
  });

  IpcMainWrapper.handle("getLiveLaunchProperties", () => {
    return Promise.resolve(getLiveManager().getLiveLaunchProperties());
  });
}
