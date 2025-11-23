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
) => void;

/**
 * Api interface exposed to Renderer process.
 */
export interface IpcApi {
  ipcApi: {
    requestConfirmingInputChannelId: Invoke<"confirmInputChannelId">;
    registerChannel: Invoke<"registerChannel">;
    requestChannelTop: Invoke<"getChannelTop">;
    requestOpenOverlay: Invoke<"startOverlayWithUserConfirmation">;
    requestUserSettings: Invoke<"getUserSettings">;
    registerUserSettings: Invoke<"saveUserSettings">;
    requestCheckHavingDifferenceAmongUserSettings: Invoke<"hasDifferenceAmongUserSettings">;
    registerUpdatedUserSettingsListener: Listen<"tellUpdatedUserSettings">;
    requestRegisteredChannels: Invoke<"getRegisterdChannels">;
    requestSwitchMainChannel: Invoke<"switchMainChannel">;
    requestDeletingChannel: Invoke<"deleteChannelWithUserConfirmation">;
    registerUpdatedChannelListListener: Listen<"tellUpdatedChannelIds">;
    requestLaunchEmitters: Invoke<"launchEmitters">;
    registerTextChatsListener: Listen<"tellTextChats">;
    registerSuperChatsListener: Listen<"tellSuperChats">;
    registerMembershipsAndGiftsListener: Listen<"tellMembershipsAndGifts">;
    registerStocksListener: Listen<"tellStocks">;
    requestAddStock: Invoke<"addStock">;
    requestRemoveStock: Invoke<"removeStock">;
    registerLiveStatisticsListener: Listen<"tellLiveStatistics">;
    requestInitialMainAppPage: Invoke<"getInitialMainAppPage">;
    registerMainAppPage: Listen<"tellMainAppPage">;
    requestStartLive: Invoke<"startLive">;
    requestQuitLive: Invoke<"quitLive">;
    registerFocusListener: Listen<"tellFocus">;
    requestUpdateFocus: Invoke<"updateFocus">;
  };
}

export const IpcApi: IpcApi = {
  ipcApi: {
    requestConfirmingInputChannelId: (inputChannelId) =>
      IpcRendererWrapper.invoke("confirmInputChannelId", inputChannelId),
    registerChannel: (channelId) => IpcRendererWrapper.invoke("registerChannel", channelId),
    requestChannelTop: (channelId) => IpcRendererWrapper.invoke("getChannelTop", channelId),
    requestOpenOverlay: (channelTop) =>
      IpcRendererWrapper.invoke("startOverlayWithUserConfirmation", channelTop),
    requestUserSettings: (channelId) => IpcRendererWrapper.invoke("getUserSettings", channelId),
    registerUserSettings: (channelId, userSettings) =>
      IpcRendererWrapper.invoke("saveUserSettings", channelId, userSettings),
    requestCheckHavingDifferenceAmongUserSettings: (settingsA, settingsB) =>
      IpcRendererWrapper.invoke("hasDifferenceAmongUserSettings", settingsA, settingsB),
    registerUpdatedUserSettingsListener: (callback) =>
      IpcRendererWrapper.on("tellUpdatedUserSettings", callback),
    requestRegisteredChannels: () => IpcRendererWrapper.invoke("getRegisterdChannels"),
    requestSwitchMainChannel: (to) => IpcRendererWrapper.invoke("switchMainChannel", to),
    requestDeletingChannel: (channel) =>
      IpcRendererWrapper.invoke("deleteChannelWithUserConfirmation", channel),
    registerUpdatedChannelListListener: (callback) =>
      IpcRendererWrapper.on("tellUpdatedChannelIds", callback),
    requestLaunchEmitters: (liveLaunchProperties) =>
      IpcRendererWrapper.invoke("launchEmitters", liveLaunchProperties),
    registerTextChatsListener: (callback) => IpcRendererWrapper.on("tellTextChats", callback),
    registerSuperChatsListener: (callback) => IpcRendererWrapper.on("tellSuperChats", callback),
    registerMembershipsAndGiftsListener: (callback) =>
      IpcRendererWrapper.on("tellMembershipsAndGifts", callback),
    registerStocksListener: (callback) => IpcRendererWrapper.on("tellStocks", callback),
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
    registerFocusListener: (callback) => IpcRendererWrapper.on("tellFocus", callback),
    requestUpdateFocus: (focus) => IpcRendererWrapper.invoke("updateFocus", focus),
  },
};
