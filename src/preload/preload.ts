import { IpcRendererWrapper } from "../ipcRendererWrapper";
import { exposeToRenderer } from "./exposeToRenderer";
import { IpcApi } from "./ipcApi";

declare global {
  interface Window extends IpcApi {}
}

const ipcApi: IpcApi = {
  ipcApi: {
    requestChannelTitleMatchTo: (inputChannelId) =>
      IpcRendererWrapper.invoke("confirmInputChannelId", inputChannelId),
  },
};

exposeToRenderer(ipcApi, "ipcApi");
