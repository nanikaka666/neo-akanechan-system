import { IpcEventForOverlay } from "./overlay";
import { IpcEventForMainWindow } from "./mainWindow";
import { CommonIpcEvent } from "./common";

/**
 * Ipc channel interfaces.
 *
 * key represents channel name.
 */
export type IpcEvent = IpcEventForMainWindow & IpcEventForOverlay & CommonIpcEvent;
