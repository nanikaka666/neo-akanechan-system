import { app } from "electron";

export function isDevMode() {
  return app.isPackaged;
}

export function platform() {
  if (process.platform === "darwin") {
    return "mac";
  }
  if (process.platform === "win32") {
    return "windows";
  }
  throw new Error("this app runs on only 'Windows' or 'MacOS'.");
}
