import { ipcRenderer, IpcRendererEvent } from "electron";
import { IpcEvent } from "../ipcEvent";

/**
 * Wrapper object of ipcRenderer.
 *
 * functions in ipcRenderer accept arbitrary combinations of key and value.
 * this wrapper has typed parameters to prevent passing unexpected pair.
 */
export const IpcRendererWrapper = {
  invoke: <K extends keyof IpcEvent>(
    key: K,
    ...args: Parameters<IpcEvent[K]>
  ): Promise<ReturnType<IpcEvent[K]>> => {
    return ipcRenderer.invoke(key, ...args);
  },
  on: <K extends keyof IpcEvent>(
    key: K,
    callback: (e: IpcRendererEvent, ...args: Parameters<IpcEvent[K]>) => void,
  ) => {
    ipcRenderer.on(key, callback);
  },
};

declare global {
  namespace Electron {
    interface IpcRenderer extends NodeJS.EventEmitter {
      /**
       * @deprecated use IpcRendererWrapper.invoke() instead.
       */
      invoke(channel: string, ...args: any[]): Promise<any>;
      /**
       * @deprecated use IpcRendererWrapper.on() instead.
       */
      on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): this;
    }
  }
}
