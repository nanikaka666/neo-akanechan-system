import { IpcMainWrapper } from "./ipcMainWrapper";
import { WebContentsWrapper } from "./webContentsWrapper";
import { getStorageService } from "./storage";
import { BrowserWindow, dialog } from "electron";
import { UserSettingsService } from "./userSettings";
import {
  AuthPage,
  BeginningBlankPage,
  ChannelSummary,
  InLivePage,
  LiveSelectionPage,
} from "../ipcEvent";
import {
  cleanUpLiveChatEmitter,
  getLiveChatManager,
  setupLiveChatEmitter,
} from "./emitter/liveChatManager";
import { cleanUpLikeCountEmitter, setupLikeCountEmitter } from "./emitter/likeCountManager";
import {
  cleanUpLiveViewCountEmitter,
  setupLiveViewCountEmitter,
} from "./emitter/liveViewCountManager";
import {
  cleanUpSubscriberCountEmitter,
  setupSubscriberCountEmitter,
} from "./emitter/subscriberCountManager";
import { cleanUpLiveStatistics, setupLiveStatistics } from "./liveStatistics";
import { doAuthFlow, isUserAuthorized } from "./auth/google";
import { YoutubeApiClient } from "./youtubeApi/client";
import { Channel } from "./youtubeApi/model";

function convertToChannelSummary(channel: Channel) {
  return {
    channelId: channel.id,
    channelTitle: channel.snippet.title,
    subscribersCount: channel.statistics.subscriberCount,
    ownerIcon: channel.snippet.thumbnails.default.url,
    channelBanner: channel.brandingSettings.image?.bannerExternalUrl,
  } satisfies ChannelSummary;
}

async function checkChannelExistence(inputChannelId: string) {
  const channel = await YoutubeApiClient.getChannel(inputChannelId);
  return channel ? convertToChannelSummary(channel) : undefined;
}

export function setupIpcMainHandlers() {
  IpcMainWrapper.handle("checkExistenceOfChannel", async (e, inputChannelId) => {
    try {
      return await checkChannelExistence(inputChannelId);
    } catch {
      return undefined;
    }
  });

  IpcMainWrapper.handle("startOverlayWithUserConfirmation", async (e, channelHavingClosestLive) => {
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
      detail: `${channelHavingClosestLive.closestLive.title}`,
    });
    if (res.response !== 0) {
      return Promise.resolve(false);
    }
    // shown on title bar of overlay window.
    const overlayWindowTitle = `*CAPTURE* ${channelHavingClosestLive.closestLive.title}`;

    // memo: temporary turn off
    // createOverlayWindow(overlayWindowTitle);

    WebContentsWrapper.send(e.sender, "tellMainAppPage", {
      type: "liveStandBy",
      liveLaunchProperties: {
        channel: channelHavingClosestLive,
        settings: UserSettingsService.getUserSettings(),
        overlayWindowTitle: overlayWindowTitle,
      },
    });
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("getUserSettings", () => {
    return Promise.resolve(UserSettingsService.getUserSettings());
  });

  IpcMainWrapper.handle("saveUserSettings", (e, channelId, userSettings) => {
    try {
      UserSettingsService.setUserSettings(userSettings);
      WebContentsWrapper.send(e.sender, "tellUpdatedUserSettings", channelId, userSettings);
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
      setupLiveChatEmitter(e.sender, liveLaunchProperties),
      setupLikeCountEmitter(liveLaunchProperties),
      setupLiveViewCountEmitter(liveLaunchProperties),
      setupSubscriberCountEmitter(liveLaunchProperties),
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
    const maybeMainChannelId = getStorageService().getMainChannelId();
    if (maybeMainChannelId) {
      return Promise.resolve({
        type: "liveSelection",
        mainChannelId: maybeMainChannelId,
        channel: (await YoutubeApiClient.getChannels([maybeMainChannelId]))[0],
        liveBroadcasts: await YoutubeApiClient.getLiveBroadcasts(),
      } satisfies LiveSelectionPage);
    } else {
      return Promise.resolve({ type: "beginningBlank" } satisfies BeginningBlankPage);
    }
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
      detail: `${liveLaunchProperties.channel.closestLive.title}`,
    });
    if (res.response !== 0) {
      return false;
    }

    // clean up emitters
    cleanUpLiveChatEmitter();
    cleanUpLikeCountEmitter();
    cleanUpLiveViewCountEmitter();
    cleanUpSubscriberCountEmitter();

    cleanUpLiveStatistics();

    // WebContentsWrapper.send(e.sender, "tellMainAppPage", {
    //   type: "liveSelection",
    //   mainChannelId: liveLaunchProperties.channel.channel.channelId,
    // } satisfies LiveSelectionPage);
    return true;
  });

  IpcMainWrapper.handle("updateFocus", (e, focus) => {
    getLiveChatManager().updateFocus(focus);
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("startAuthFlow", async (e) => {
    if (!(await doAuthFlow())) {
      return false;
    }
    try {
      const channel = await YoutubeApiClient.getChannelOfMine();
      getStorageService().registerChannelIdAndMarkAsMain(channel.id);
      // WebContentsWrapper.send(e.sender, "tellMainAppPage", {
      //   type: "liveSelection",
      //   mainChannelId: getStorageService().getMainChannelId()!,
      // });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  });
}
