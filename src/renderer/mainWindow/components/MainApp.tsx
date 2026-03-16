import { useEffect, useState } from "react";
import { MainAppPage } from "../../../types/mainAppPage";
import { LiveStandBy } from "./liveStandBy/LiveStandBy";
import { LiveControlPanel } from "./liveControlPanel/LiveControlPanel";
import { AuthFlow } from "./auth/AuthFlow";
import { LiveSelection } from "./liveSelection/LiveSelection";

export function MainApp() {
  const [mainAppPage, setMainAppPage] = useState<MainAppPage>();

  useEffect(() => {
    window.ipcApi.requestInitialMainAppPage().then((page) => {
      setMainAppPage((_) => page);
    });
    const remover = window.ipcApi.registerMainAppPage((e, page) => {
      setMainAppPage((_) => page);
    });
    return () => remover();
  }, []);

  return mainAppPage ? (
    mainAppPage.type === "liveControlPanel" ? (
      <LiveControlPanel />
    ) : mainAppPage.type === "liveStandBy" ? (
      <LiveStandBy />
    ) : mainAppPage.type === "liveSelection" ? (
      <LiveSelection {...mainAppPage} />
    ) : (
      <AuthFlow />
    )
  ) : (
    <div>Now Loading...</div>
  );
}
