import { ipcMain, IpcMainInvokeEvent } from "electron";
import { IpcEvent } from "../ipcEvent";

/**
 * Wrapper object of ipcMain.
 *
 * functions in ipcMain accept arbitrary combinations of key and value.
 * this wrapper has typed parameters to prevent passing unexpected pair.
 */
export const IpcMainWrapper = {
  handle: <K extends keyof IpcEvent>(
    key: K,
    callback: (
      e: IpcMainInvokeEvent,
      ...args: Parameters<IpcEvent[K]>
    ) => Promise<ReturnType<IpcEvent[K]>>,
  ) => {
    ipcMain.handle(key, callback);
  },
};

declare global {
  namespace Electron {
    interface IpcMain extends NodeJS.EventEmitter {
      /**
       * @deprecated use IpcMainWrapper.handle() instead.
       */
      handle(
        channel: string,
        listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any,
      ): void;
    }
  }
}
