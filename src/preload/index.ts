import { exposeToRenderer } from "./exposeToRenderer";
import { IpcApi } from "./ipcApi";

exposeToRenderer(IpcApi, "ipcApi");
