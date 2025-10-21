import { WebContents } from "electron";
import { IpcEvent } from "../ipcEvent";

/**
 * Wrapper of webContents.send.
 *
 * webContents.send() accept arbitrary combinations of key and value.
 * this wrapper has typed parameters to prevent passing unexpected pair.
 */
export const WebContentsWrapper = {
  send: <K extends keyof IpcEvent>(
    webContents: WebContents,
    key: K,
    ...args: Parameters<IpcEvent[K]>
  ) => {
    webContents.send(key, ...args);
  },
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Electron {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    interface WebContents {
      /**
       * @deprecated use IpcRendererWrapper.invoke() instead.
       */
      send(channel: string, ...args: any[]): void;
    }
  }
}
