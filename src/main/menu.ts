import { Menu, MenuItemConstructorOptions } from "electron";

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

export function setupApplicationMenu() {
  const menu: MenuItemConstructorOptions[] = [
    ...makeAppMenu(),
    ...makeFileMenu(),
    ...makeEditMenu(),
    ...makeViewMenu(),
    ...makeWindowMenu(),
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}
