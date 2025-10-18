import { Menu, MenuItemConstructorOptions } from "electron";

export function setupApplicationMenu() {
  const menu: MenuItemConstructorOptions[] = [
    {
      role: "appMenu",
    },
    {
      role: "fileMenu",
    },
    {
      role: "editMenu",
    },
    {
      role: "viewMenu",
    },
    {
      role: "windowMenu",
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}
