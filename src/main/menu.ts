import { BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";
import { StorageService } from "./storage";
import { isDevMode, platform } from "./environment";

function makeAppMenu(): MenuItemConstructorOptions[] {
  return [
    {
      role: "appMenu",
    },
  ];
}

function makeFileMenu(): MenuItemConstructorOptions[] {
  return [
    {
      role: "fileMenu",
    },
  ];
}

function makeEditMenu(): MenuItemConstructorOptions[] {
  return [
    {
      role: "editMenu",
    },
  ];
}

function makeViewMenu(): MenuItemConstructorOptions[] {
  return [
    {
      role: "viewMenu",
    },
  ];
}

function makeWindowMenu(): MenuItemConstructorOptions[] {
  return [
    {
      role: "windowMenu",
    },
  ];
}

function makeDebugMenu(): MenuItemConstructorOptions[] {
  const submenu: MenuItemConstructorOptions[] = [
    {
      label: "Show Storage Data",
      click: () => {
        console.log(StorageService.getAll());
      },
    },
    {
      label: "Clear Storage Data",
      click: () => {
        StorageService.clearAll();
        console.log("clear storage data.");
        BrowserWindow.getFocusedWindow()?.reload();
      },
    },
  ];

  return [
    {
      label: "Debug",
      submenu: submenu,
    },
  ];
}

export function setupApplicationMenu() {
  const menu: MenuItemConstructorOptions[] = [];

  if (platform() === "mac") {
    menu.push(...makeAppMenu());
  }

  menu.push(...makeFileMenu());
  menu.push(...makeEditMenu());
  menu.push(...makeViewMenu());
  menu.push(...makeWindowMenu());

  if (isDevMode()) {
    menu.push(...makeDebugMenu());
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}
