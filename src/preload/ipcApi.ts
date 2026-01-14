import { IpcRendererEvent } from "electron";
import { IpcEvent } from "../ipcEvent";
import { IpcRendererWrapper } from "./ipcRendererWrapper";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window extends IpcApi {}
}

type Invoke<K extends keyof IpcEvent> = (
  ...args: Parameters<IpcEvent[K]>
) => Promise<ReturnType<IpcEvent[K]>>;

type Listen<K extends keyof IpcEvent> = (
  callback: (e: IpcRendererEvent, ...args: Parameters<IpcEvent[K]>) => void,
) => () => void;

/**
 * Api interface exposed to Renderer process.
 */
export interface IpcApi {
  ipcApi: {
    requestOpenOverlay: Invoke<"startOverlayWithUserConfirmation">;
    requestOpenOverlayWithVideoId: Invoke<"startOverlayWithUserConfirmationByVideoId">;
    requestUserSettings: Invoke<"getUserSettings">;
    requestSaveUserSettings: Invoke<"saveUserSettings">;
    requestCheckHavingDifferenceAmongUserSettings: Invoke<"hasDifferenceAmongUserSettings">;
    registerUpdatedUserSettingsListener: Listen<"tellUpdatedUserSettings">;
    requestLaunchEmitters: Invoke<"launchEmitters">;
    registerMembershipsAndGiftsListener: Listen<"tellMembershipsAndGifts">;
    requestAddStock: Invoke<"addStock">;
    requestRemoveStock: Invoke<"removeStock">;
    registerLiveStatisticsListener: Listen<"tellLiveStatistics">;
    requestInitialMainAppPage: Invoke<"getInitialMainAppPage">;
    registerMainAppPage: Listen<"tellMainAppPage">;
    requestStartLive: Invoke<"startLive">;
    requestQuitLive: Invoke<"quitLive">;
    requestUpdateFocus: Invoke<"updateFocus">;
    registerChatsListener: Listen<"tellChats">;
    requestStartAuthFlow: Invoke<"startAuthFlow">;
  };
}

export const IpcApi: IpcApi = {
  ipcApi: {
    requestOpenOverlay: (channel, live) =>
      IpcRendererWrapper.invoke("startOverlayWithUserConfirmation", channel, live),
    requestOpenOverlayWithVideoId: (inputVideoId) =>
      IpcRendererWrapper.invoke("startOverlayWithUserConfirmationByVideoId", inputVideoId),
    requestUserSettings: () => IpcRendererWrapper.invoke("getUserSettings"),
    requestSaveUserSettings: (userSettings) =>
      IpcRendererWrapper.invoke("saveUserSettings", userSettings),
    requestCheckHavingDifferenceAmongUserSettings: (settingsA, settingsB) =>
      IpcRendererWrapper.invoke("hasDifferenceAmongUserSettings", settingsA, settingsB),
    registerUpdatedUserSettingsListener: (callback) =>
      IpcRendererWrapper.on("tellUpdatedUserSettings", callback),
    requestLaunchEmitters: (liveLaunchProperties) =>
      IpcRendererWrapper.invoke("launchEmitters", liveLaunchProperties),
    registerMembershipsAndGiftsListener: (callback) =>
      IpcRendererWrapper.on("tellMembershipsAndGifts", callback),
    requestAddStock: (stock) => IpcRendererWrapper.invoke("addStock", stock),
    requestRemoveStock: (stock) => IpcRendererWrapper.invoke("removeStock", stock),
    registerLiveStatisticsListener: (callback) =>
      IpcRendererWrapper.on("tellLiveStatistics", callback),
    requestInitialMainAppPage: () => IpcRendererWrapper.invoke("getInitialMainAppPage"),
    registerMainAppPage: (callback) => IpcRendererWrapper.on("tellMainAppPage", callback),
    requestStartLive: (liveLaunchProperties) =>
      IpcRendererWrapper.invoke("startLive", liveLaunchProperties),
    requestQuitLive: (liveLaunchProperties) =>
      IpcRendererWrapper.invoke("quitLive", liveLaunchProperties),
    requestUpdateFocus: (focus) => IpcRendererWrapper.invoke("updateFocus", focus),
    registerChatsListener: (callback) => IpcRendererWrapper.on("tellChats", callback),
    requestStartAuthFlow: () => IpcRendererWrapper.invoke("startAuthFlow"),
  },
};
