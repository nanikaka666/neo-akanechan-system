import { app } from "electron";

export function isDevMode() {
  return app.isPackaged;
}
