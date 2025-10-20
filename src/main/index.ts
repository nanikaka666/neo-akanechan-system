import { app, BrowserWindow } from "electron";
import { checkElectronSquirrelStartup } from "./checkElectronSquirrelStartup";
import { IpcMainWrapper } from "./ipcMainWrapper";
import { PageFetcher, Scraper } from "youtube-live-scraper";
import { StorageService } from "./storage";
import { createWindow } from "./mainWindow";
import { setupApplicationMenu } from "./menu";
import { platform } from "./environment";
import { WebContentsWrapper } from "./webContentsWrapper";

/**
 * Quit when all windows are closed, except on macOS. There, it's common
 * for applications and their menu bar to stay active until the user quits
 * explicitly with Cmd + Q.
 */
const onWindowAllClosed = () => {
  if (platform() !== "mac") {
    app.quit();
  }
};

/**
 * Mac OS only.
 *
 * On OS X it's common to re-create a window in the app when the
 * dock icon is clicked and there are no other windows open.
 *
 * @param _event
 * @param _habVisibleWindows
 */
const onActivate = (_event: Electron.Event, _habVisibleWindows: boolean) => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
};

function main() {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (checkElectronSquirrelStartup()) {
    app.quit();
  }

  app.on("window-all-closed", onWindowAllClosed);

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
    return Promise.resolve(StorageService.getMainChannelId());
  });

  IpcMainWrapper.handle("registerChannel", (e, channelId) => {
    if (channelId.isHandle) {
      return Promise.resolve(false);
    }
    if (!StorageService.registerChannelIdAndMarkAsMain(channelId)) {
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

  app.whenReady().then(() => {
    setupApplicationMenu();
    createWindow();
    app.on("activate", onActivate);
  });
}

main();
