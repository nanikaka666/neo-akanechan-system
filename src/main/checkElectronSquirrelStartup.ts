export function checkElectronSquirrelStartup() {
  return require("electron-squirrel-startup") as boolean;
}
