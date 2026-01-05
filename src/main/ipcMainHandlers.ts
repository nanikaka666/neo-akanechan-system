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

  IpcMainWrapper.handle("registerChannel", async (e, channelId) => {
    if (!getStorageService().registerChannelIdAndMarkAsMain(channelId)) {
      return Promise.resolve(false);
    }
    // WebContentsWrapper.send(e.sender, "tellMainAppPage", {
    //   type: "liveSelection",
    //   mainChannelId: channelId,
    // } satisfies LiveSelectionPage);
    const res = await (
      await YoutubeApiClient.getChannels(getStorageService().getRegisteredChannelIds())
    ).map(convertToChannelSummary);
    WebContentsWrapper.send(e.sender, "tellUpdatedChannelIds", res);
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("getChannelTop", async (e, channelId) => {
    return Promise.resolve(undefined);
    // try {
    //   const channel = await getChannelSummary(channelId);
    //   const maybeClosestLivePage = await PageFetcher.getLivePage(channelId);

    //   const closestLive =
    //     maybeClosestLivePage.type === "channel"
    //       ? undefined
    //       : {
    //           title: Scraper.getVideoTitle(maybeClosestLivePage),
    //           // thumbnail: Scraper.getVideoThumbnail(maybeClosestLivePage),
    //           thumbnail: `https://i.ytimg.com/vi/${maybeClosestLivePage.videoId.id}/maxresdefault.jpg`, // temporary aid
    //           // isOnAir: Scraper.isLiveNow(maybeClosestLivePage),
    //           isOnAir: !maybeClosestLivePage.html.includes(`"scheduledStartTime"`), // temporary aid
    //         };

    //   if (closestLive === undefined) {
    //     return {
    //       type: "has_no_closest_live",
    //       channel: channel,
    //     };
    //   } else {
    //     return {
    //       type: "has_closest_live",
    //       channel: channel,
    //       closestLive: closestLive,
    //     };
    //   }
    // } catch (e: unknown) {
    //   console.log(e);
    //   return undefined;
    // }
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
        settings: UserSettingsService.getUserSettings(channelHavingClosestLive.channel.channelId),
        overlayWindowTitle: overlayWindowTitle,
      },
    });
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("getUserSettings", (e, channelId) => {
    return Promise.resolve(UserSettingsService.getUserSettings(channelId));
  });

  IpcMainWrapper.handle("saveUserSettings", (e, channelId, userSettings) => {
    try {
      UserSettingsService.setUserSettings(channelId, userSettings);
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

  IpcMainWrapper.handle("getRegisterdChannels", async () => {
    return (await YoutubeApiClient.getChannels(getStorageService().getRegisteredChannelIds())).map(
      convertToChannelSummary,
    );
  });

  IpcMainWrapper.handle("switchMainChannel", (e, to) => {
    if (getStorageService().switchMainChannel(to)) {
      // WebContentsWrapper.send(e.sender, "tellMainAppPage", {
      //   type: "liveSelection",
      //   mainChannelId: to,
      // } satisfies LiveSelectionPage);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  });

  IpcMainWrapper.handle("deleteChannelWithUserConfirmation", async (e, channel) => {
    const window = BrowserWindow.fromWebContents(e.sender);
    if (window === null) {
      return false;
    }
    const res = await dialog.showMessageBox(window, {
      message: `このチャンネルをリストから削除しますか？`,
      type: "question",
      buttons: ["OK", "NO"],
      defaultId: 0,
      detail: `${channel.channelTitle}`,
    });
    if (res.response !== 0) {
      return false;
    }

    const oldMainChannelId = getStorageService().getMainChannelId();
    getStorageService().deleteChannel(channel);
    const latestMainChannelId = getStorageService().getMainChannelId();
    if (oldMainChannelId?.id !== latestMainChannelId?.id) {
      // WebContentsWrapper.send(
      //   e.sender,
      //   "tellMainAppPage",
      //   latestMainChannelId
      //     ? ({
      //         type: "liveSelection",
      //         mainChannelId: latestMainChannelId,
      //       } satisfies LiveSelectionPage)
      //     : ({ type: "beginningBlank" } satisfies BeginningBlankPage),
      // );
    }
    const nextChannels = await (
      await YoutubeApiClient.getChannels(getStorageService().getRegisteredChannelIds())
    ).map(convertToChannelSummary);
    WebContentsWrapper.send(e.sender, "tellUpdatedChannelIds", nextChannels);
    return true;
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
    const channelId = await YoutubeApiClient.getChannelIdOfMine();
    if (!channelId) {
      throw new Error(
        "Auth is succeeded, but your channel ID registration is failed. Please retry auth again.",
      );
    }
    getStorageService().registerChannelIdAndMarkAsMain(channelId);
    // WebContentsWrapper.send(e.sender, "tellMainAppPage", {
    //   type: "liveSelection",
    //   mainChannelId: getStorageService().getMainChannelId()!,
    // });
    return true;
  });
}
