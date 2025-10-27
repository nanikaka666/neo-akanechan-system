import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { isDevMode } from "./environment";

/**
 * Setup React Devtools on Developement build.
 *
 * NOTE: The tool can not appear on first view. Manual reload action is needed.
 * @see https://github.com/electron/electron/issues/41613
 */
export async function setupReactDevtools() {
  if (!isDevMode()) {
    return;
  }
  await installExtension(REACT_DEVELOPER_TOOLS);
}
