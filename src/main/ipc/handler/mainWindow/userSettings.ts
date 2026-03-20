import { isExistLiveManager, getLiveManager } from "../../../liveManager";
import { UserSettingsService } from "../../../userSettings";
import { WebContentsWrapper } from "../../../webContentsWrapper";
import { IpcMainWrapper } from "../../ipcMainWrapper";

export function setupIpcMainHandlersForUserSettings() {
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
}
