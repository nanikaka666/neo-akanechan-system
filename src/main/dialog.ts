import { dialog } from "electron";
import { getWindowManager } from "./window";

export async function yesNoDialogOnMainWindow(message: string, detail?: string) {
  const mainWindow = getWindowManager().getMainWindow();
  if (mainWindow === undefined) {
    return false;
  }
  const res = await dialog.showMessageBox(mainWindow, {
    message: message,
    type: "question",
    buttons: ["OK", "NO"],
    defaultId: 0,
    detail: detail,
  });

  return res.response === 0;
}
