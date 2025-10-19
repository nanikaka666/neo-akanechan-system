import { app, BrowserWindow } from "electron";
import { checkElectronSquirrelStartup } from "./checkElectronSquirrelStartup";
import { IpcMainWrapper } from "./ipcMainWrapper";
import { PageFetcher, Scraper } from "youtube-live-scraper";
import { StorageService } from "./storage";
import { createWindow } from "./mainWindow";
import { setupApplicationMenu } from "./menu";
import { platform } from "./environment";

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
    // tell to renderer that core data changed.
    return Promise.resolve(true);
  });

  app.whenReady().then(() => {
    setupApplicationMenu();
    createWindow();
    app.on("activate", onActivate);
  });
}

main();
