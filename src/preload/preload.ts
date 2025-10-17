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
    requestMainChannel: () => IpcRendererWrapper.invoke("getMainChannel"),
  },
};

exposeToRenderer(ipcApi, "ipcApi");
