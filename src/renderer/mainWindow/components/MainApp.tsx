import { useEffect, useState } from "react";
import { ChannelRegistrationLoader } from "./channelRegistration/ChannelRegistrationLoader";
import { MainChannelTopLoader } from "./top/MainChannelTopLoader";
import { MainAppPage } from "../../../ipcEvent";
import { LiveControlPanelInStandBy } from "./liveControl/LiveControlPanelInStandBy";

export function MainApp() {
  const [mainAppPage, setMainAppPage] = useState<MainAppPage>();

  useEffect(() => {
    window.ipcApi.requestInitialMainAppPage().then((page) => {
      setMainAppPage((_) => page);
      window.ipcApi.registerMainAppPage((e, page) => {
        setMainAppPage((_) => page);
      });
    });
  }, []);

  return mainAppPage ? (
    mainAppPage.type === "liveStandBy" ? (
      <LiveControlPanelInStandBy liveLaunchProperties={mainAppPage.liveLaunchProperties} />
    ) : mainAppPage.type === "liveSelection" ? (
      <MainChannelTopLoader mainChannelId={mainAppPage.mainChannelId} />
    ) : (
      <ChannelRegistrationLoader />
    )
  ) : (
    <div>Now Loading...</div>
  );
}
