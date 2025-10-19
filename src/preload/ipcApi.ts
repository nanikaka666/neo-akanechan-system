import { IpcRendererEvent } from "electron";
import { IpcEvent } from "../ipcEvent";

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
  };
}
