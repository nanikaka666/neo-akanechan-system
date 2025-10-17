import { IpcRendererWrapper } from "../ipcRendererWrapper";
import { exposeToRenderer } from "./exposeToRenderer";
import { IpcApi } from "./ipcApi";

declare global {
  interface Window extends IpcApi {}
}

const ipcApi: IpcApi = {
  ipcApi: {
    requestConfirmingInputChannelId: (inputChannelId) =>
      IpcRendererWrapper.invoke("confirmInputChannelId", inputChannelId),
    requestMainChannelId: () => IpcRendererWrapper.invoke("getMainChannelId"),
  },
};

exposeToRenderer(ipcApi, "ipcApi");
