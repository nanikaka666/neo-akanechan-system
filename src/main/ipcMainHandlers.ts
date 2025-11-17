import { ChannelId, PageFetcher, Scraper } from "youtube-live-scraper";
import { IpcMainWrapper } from "./ipcMainWrapper";
import { WebContentsWrapper } from "./webContentsWrapper";
import { getStorageService } from "./storage";
import { BrowserWindow, dialog } from "electron";
import { createOverlayWindow } from "./overlayWindow";
import { UserSettingsService } from "./userSettings";
import { ChannelSummary, LiveLaunchProperties } from "../ipcEvent";
import { setupLiveChatEmitter } from "./emitter/liveChatManager";
import { setupLikeCountEmitter } from "./emitter/likeCountManager";

/**
 * temporary aid method.
 */
function extractChannelIdInYoutubeIdStyle(html: string) {
  // todo: this convert must be done in Scraper.
  const res = html.match(/"externalId":"(.+?)"/);
  if (res === null) {
    throw new Error("Youtube Id not found.");
  }
  return new ChannelId(res[1]);
}

async function getChannelSummary(channelId: ChannelId) {
  const page = await PageFetcher.getChannelPage(channelId);

  // const channelIdYoutubeIdStyle = Scraper.hogehoge();

  /** temporary aid */
  const channelIdInYoutubeId = channelId.isHandle
    ? extractChannelIdInYoutubeIdStyle(page.html)
    : channelId;

  return {
    channelId: channelIdInYoutubeId,
    channelTitle: Scraper.getChannelTitleFromChannelPage(page),
    subscribersCount: Scraper.getSubscriberCountFromChannelPage(page),
    ownerIcon: Scraper.getOwnerIconUrlFromChannelPage(page),
    channelBanner: Scraper.getChannelBanner(page),
  } satisfies ChannelSummary;
}

export function setupIpcMainHandlers() {
  IpcMainWrapper.handle("confirmInputChannelId", async (e, inputChannelId) => {
    try {
      return await getChannelSummary(inputChannelId);
    } catch {
      return undefined;
    }
  });

  IpcMainWrapper.handle("getMainChannelId", () => {
    return Promise.resolve(getStorageService().getMainChannelId());
  });

  IpcMainWrapper.handle("registerChannel", (e, channelId) => {
    if (channelId.isHandle) {
      return Promise.resolve(false);
    }
    if (!getStorageService().registerChannelIdAndMarkAsMain(channelId)) {
      return Promise.resolve(false);
    }
    WebContentsWrapper.send(e.sender, "tellNewMainChannelId", channelId);
    return Promise.resolve(true);
  });

  IpcMainWrapper.handle("getChannelTop", async (e, channelId) => {
    try {
      const channel = await getChannelSummary(channelId);
      const maybeClosestLivePage = await PageFetcher.getLivePage(channelId);

      const closestLive =
        maybeClosestLivePage.type === "channel"
          ? undefined
          : {
              title: Scraper.getVideoTitle(maybeClosestLivePage),
              // thumbnail: Scraper.getVideoThumbnail(maybeClosestLivePage),
              thumbnail: `https://i.ytimg.com/vi/${maybeClosestLivePage.videoId.id}/maxresdefault.jpg`, // temporary aid
              // isOnAir: Scraper.isLiveNow(maybeClosestLivePage),
              isOnAir: !maybeClosestLivePage.html.includes(`"scheduledStartTime"`), // temporary aid
            };

      if (closestLive === undefined) {
        return {
          type: "has_no_closest_live",
          channel: channel,
        };
      } else {
        return {
          type: "has_closest_live",
          channel: channel,
          closestLive: closestLive,
        };
      }
    } catch (e: unknown) {
      console.log(e);
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
      detail: `${channelHavingClosestLive.closestLive.title.title}`,
    });
    if (res.response !== 0) {
      return Promise.resolve(false);
    }
    // shown on title bar of overlay window.
    const overlayWindowTitle = `*CAPTURE* ${channelHavingClosestLive.closestLive.title.title}`;
    createOverlayWindow(overlayWindowTitle);

    WebContentsWrapper.send(e.sender, "tellOverlayStarted", {
      channel: channelHavingClosestLive,
      settings: UserSettingsService.getUserSettings(channelHavingClosestLive.channel.channelId),
      overlayWindowTitle: overlayWindowTitle,
    } satisfies LiveLaunchProperties);
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

  IpcMainWrapper.handle("getRegisterdChannels", () => {
    return Promise.all(getStorageService().getRegisteredChannelIds().map(getChannelSummary));
  });

  IpcMainWrapper.handle("switchMainChannel", (e, to) => {
    if (getStorageService().switchMainChannel(to)) {
      WebContentsWrapper.send(e.sender, "tellNewMainChannelId", to);
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
      detail: `${channel.channelTitle.title}`,
    });
    if (res.response !== 0) {
      return false;
    }

    const oldMainChannelId = getStorageService().getMainChannelId();
    getStorageService().deleteChannel(channel);
    const latestMainChannelId = getStorageService().getMainChannelId();
    if (oldMainChannelId?.id !== latestMainChannelId?.id) {
      WebContentsWrapper.send(e.sender, "tellNewMainChannelId", latestMainChannelId);
    } else {
      const res =
        (await Promise.all(getStorageService().getRegisteredChannelIds().map(getChannelSummary))) ??
        [];
      WebContentsWrapper.send(e.sender, "tellUpdatedChannelIds", res);
    }
    return true;
  });

  IpcMainWrapper.handle("launchEmitters", async (e, liveLaunchProperties) => {
    await Promise.all([
      setupLiveChatEmitter(e.sender, liveLaunchProperties),
      setupLikeCountEmitter(e.sender, liveLaunchProperties),
    ]);
    return true;
  });
}
