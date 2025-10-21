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
  },
};
