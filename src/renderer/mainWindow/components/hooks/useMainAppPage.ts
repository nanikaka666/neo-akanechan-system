import { useEffect, useState } from "react";
import { MainAppPage } from "../../../../types/mainAppPage";

export function useMainAppPage() {
  const [mainAppPage, setMainAppPage] = useState<MainAppPage>();

  useEffect(() => {
    window.ipcApi.mainWindow.requestInitialMainAppPage().then((page) => {
      setMainAppPage((_) => page);
    });
    const remover = window.ipcApi.mainWindow.registerMainAppPage((e, page) => {
      setMainAppPage((_) => page);
    });
    return () => remover();
  }, []);

  return mainAppPage;
}
