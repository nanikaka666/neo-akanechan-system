import { app, BrowserWindow } from "electron";
import { checkElectronSquirrelStartup } from "./checkElectronSquirrelStartup";
import { createMainWindow } from "./mainWindow";
import { setupApplicationMenu } from "./menu";
import { platform } from "./environment";
import { setupIpcMainHandlers } from "./ipcMainHandlers";
import { setupReactDevtools } from "./reactDevtools";
import { setupAuth } from "./auth/google";
import { YoutubeApiService } from "./youtubeApi/service";
import { VideoId } from "./youtubeApi/model";
import { LiveChatEmitter } from "./emitter/liveChatEmitter";

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
    createMainWindow();
  }
};

function main() {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (checkElectronSquirrelStartup()) {
    app.quit();
  }

  app.on("window-all-closed", onWindowAllClosed);

  setupIpcMainHandlers();

  app.whenReady().then(async () => {
    setupApplicationMenu();
    await setupReactDevtools();
    await setupAuth();

    // createMainWindow();

    const video = await YoutubeApiService.getVideo(new VideoId("f4LflEcxedw"));
    if (video?.type === "inLive") {
      console.log("emitter start");
      const e = new LiveChatEmitter(video.activeLiveChatId);
      e.start();
    }

    app.on("activate", onActivate);
  });
}

main();
