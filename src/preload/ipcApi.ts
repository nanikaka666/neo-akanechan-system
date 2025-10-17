import { IpcEvent } from "../ipcEvent";

type Invoke<K extends keyof IpcEvent> = (
  ...args: Parameters<IpcEvent[K]>
) => Promise<ReturnType<IpcEvent[K]>>;

/**
 * Api interface exposed to Renderer process.
 */
export interface IpcApi {
  ipcApi: {
    requestConfirmingInputChannelId: Invoke<"confirmInputChannelId">;
    requestMainChannelId: Invoke<"getMainChannelId">;
  };
}
