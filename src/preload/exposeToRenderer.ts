import { contextBridge } from "electron";

/**
 * This is only function to expose features worked on main process.
 */
export function exposeToRenderer<T extends object, K extends keyof T>(obj: T, key: K) {
  contextBridge.exposeInMainWorld(key as string, obj[key]);
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Electron {
    interface ContextBridge {
      /**
       * @deprecated use exposeToRenderer() instead.
       */
      exposeInMainWorld(apiKey: string, api: any): void;
    }
  }
}
