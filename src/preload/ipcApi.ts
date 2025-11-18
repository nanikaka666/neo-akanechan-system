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
    requestMainChannelId: Invoke<"getMainChannelId">;
    registerChannel: Invoke<"registerChannel">;
    registerNewMainChannelListener: Listen<"tellNewMainChannelId">;
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
    registerIsStartedOverlayListener: Listen<"tellOverlayStarted">;
    requestLaunchEmitters: Invoke<"launchEmitters">;
    registerChatCountListener: Listen<"tellChatCount">;
    registerChatUUListener: Listen<"tellChatUniqueUserCount">;
    registerLikeCountListener: Listen<"tellLikeCount">;
    registerLiveViewCountListener: Listen<"tellLiveViewCount">;
    registerSubscriberCountListener: Listen<"tellSubscriberCount">;
    registerTextChatsListener: Listen<"tellTextChats">;
    registerSuperChatsListener: Listen<"tellSuperChats">;
  };
}

export const IpcApi: IpcApi = {
  ipcApi: {
    requestConfirmingInputChannelId: (inputChannelId) =>
      IpcRendererWrapper.invoke("confirmInputChannelId", inputChannelId),
    requestMainChannelId: () => IpcRendererWrapper.invoke("getMainChannelId"),
    registerChannel: (channelId) => IpcRendererWrapper.invoke("registerChannel", channelId),
    registerNewMainChannelListener: (callback) =>
      IpcRendererWrapper.on("tellNewMainChannelId", callback),
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
    registerIsStartedOverlayListener: (callback) =>
      IpcRendererWrapper.on("tellOverlayStarted", callback),
    requestLaunchEmitters: (liveLaunchProperties) =>
      IpcRendererWrapper.invoke("launchEmitters", liveLaunchProperties),
    registerChatCountListener: (callback) => IpcRendererWrapper.on("tellChatCount", callback),
    registerChatUUListener: (callback) =>
      IpcRendererWrapper.on("tellChatUniqueUserCount", callback),
    registerLikeCountListener: (callback) => IpcRendererWrapper.on("tellLikeCount", callback),
    registerLiveViewCountListener: (callback) =>
      IpcRendererWrapper.on("tellLiveViewCount", callback),
    registerSubscriberCountListener: (callback) =>
      IpcRendererWrapper.on("tellSubscriberCount", callback),
    registerTextChatsListener: (callback) => IpcRendererWrapper.on("tellTextChats", callback),
    registerSuperChatsListener: (callback) => IpcRendererWrapper.on("tellSuperChats", callback),
  },
};
