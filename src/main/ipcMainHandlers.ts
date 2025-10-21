import { PageFetcher, Scraper } from "youtube-live-scraper";
import { IpcMainWrapper } from "./ipcMainWrapper";
import { WebContentsWrapper } from "./webContentsWrapper";
import { getStorageService } from "./storage";

export function setupIpcMainHandlers() {
  IpcMainWrapper.handle("confirmInputChannelId", async (e, inputChannelId) => {
    try {
      const page = await PageFetcher.getChannelPage(inputChannelId);
      return {
        channelId: inputChannelId, //TODO: convert to Youtube ID style if needed.
        channelTitle: Scraper.getChannelTitleFromChannelPage(page),
        subscribersCount: Scraper.getSubscriberCountFromChannelPage(page),
        ownerIcon: Scraper.getOwnerIconUrlFromChannelPage(page),
      };
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
      const channelPage = await PageFetcher.getChannelPage(channelId);
      const channel = {
        channelId: channelId,
        channelTitle: Scraper.getChannelTitleFromChannelPage(channelPage),
        subscribersCount: Scraper.getSubscriberCountFromChannelPage(channelPage),
        ownerIcon: Scraper.getOwnerIconUrlFromChannelPage(channelPage),
        channelBanner: Scraper.getChannelBanner(channelPage),
      };

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
      return { channel, closestLive };
    } catch (e: unknown) {
      console.log(e);
      return undefined;
    }
  });
}
