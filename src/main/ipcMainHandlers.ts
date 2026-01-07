import { IpcMainWrapper } from "./ipcMainWrapper";
import { WebContentsWrapper } from "./webContentsWrapper";
import { BrowserWindow, dialog } from "electron";
import { UserSettingsService } from "./userSettings";
import { AuthPage, InLivePage, LiveSelectionPage } from "../ipcEvent";
import { cleanUpLiveChatEmitter, getLiveChatManager } from "./emitter/liveChatManager";
import {
  cleanupVideoStatisticsManager,
  setupVideoStatisticsManager,
} from "./emitter/videoStatisticsManager";
import {
  cleanupChannelStatisticsManager,
  setupChannelStatisticsManager,
} from "./emitter/channelStatisticsManager";
import { cleanUpLiveStatistics, setupLiveStatistics } from "./liveStatistics";
import { doAuthFlow, isUserAuthorized } from "./auth/google";
import { YoutubeApiService } from "./youtubeApi/service";
import { buildLiveLaunchProperties } from "./liveLaunchProperties";

export function setupIpcMainHandlers() {
  IpcMainWrapper.handle("startOverlayWithUserConfirmation", async (e, channel, live) => {
    if (BrowserWindow.getAllWindows().length === 2) {
      // already overlay window opened.
      return Promise.resolve(false);
    }
    const window = BrowserWindow.fromWebContents(e.sender);
    if (window === null) {
      return Promise.resolve(false);
    }
    const res = await dialog.showMessageBox(window, {
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
    // const liveLaunchProperties = await buildLiveLaunchPropertiesForDebug();

    // memo: temporary turn off
    // createOverlayWindow(overlayWindowTitle);

    WebContentsWrapper.send(e.sender, "tellMainAppPage", {
      type: "liveStandBy",
      liveLaunchProperties: liveLaunchProperties,
    });
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("getUserSettings", () => {
    return Promise.resolve(UserSettingsService.getUserSettings());
  });

  IpcMainWrapper.handle("saveUserSettings", (e, userSettings) => {
    try {
      UserSettingsService.setUserSettings(userSettings);
      WebContentsWrapper.send(e.sender, "tellUpdatedUserSettings", userSettings);
      return Promise.resolve(true);
    } catch (e: unknown) {
      console.log(e);
      return Promise.resolve(false);
    }
  });

  IpcMainWrapper.handle("hasDifferenceAmongUserSettings", (e, settingsA, settingsB) => {
    return Promise.resolve(!UserSettingsService.isEqual(settingsA, settingsB));
  });

  IpcMainWrapper.handle("launchEmitters", async (e, liveLaunchProperties) => {
    setupLiveStatistics(e.sender);

    await Promise.all([
      // setupLiveChatEmitter(e.sender, liveLaunchProperties),
      // setupLikeCountEmitter(liveLaunchProperties),
      // setupLiveViewCountEmitter(liveLaunchProperties),
      setupChannelStatisticsManager(liveLaunchProperties),
      setupVideoStatisticsManager(liveLaunchProperties),
    ]);
    return true;
  });

  IpcMainWrapper.handle("addStock", (e, item) => {
    return Promise.resolve(getLiveChatManager().addStock(item));
  });

  IpcMainWrapper.handle("removeStock", (e, item) => {
    return Promise.resolve(getLiveChatManager().removeStock(item));
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

  IpcMainWrapper.handle("startLive", (e, liveLaunchProperties) => {
    WebContentsWrapper.send(e.sender, "tellMainAppPage", {
      type: "inLive",
      liveLaunchProperties: liveLaunchProperties,
    } satisfies InLivePage);

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
    cleanUpLiveChatEmitter();
    cleanupVideoStatisticsManager();
    cleanupChannelStatisticsManager();

    cleanUpLiveStatistics();

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
    getLiveChatManager().updateFocus(focus);
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
}
