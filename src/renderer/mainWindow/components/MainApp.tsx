import { useEffect, useState } from "react";
import { ChannelRegistrationLoader } from "./channelRegistration/ChannelRegistrationLoader";
import { MainChannelTopLoader } from "./top/MainChannelTopLoader";
import { LiveLaunchProperties, MainAppPage } from "../../../ipcEvent";
import { LiveControlPanelInStandBy } from "./liveControl/LiveControlPanelInStandBy";

export function MainApp() {
  const [liveLaunchProperties, setLiveLaunchProperties] = useState<LiveLaunchProperties>();
  const [mainAppPage, setMainAppPage] = useState<MainAppPage>();

  useEffect(() => {
    window.ipcApi.requestInitialMainAppPage().then((page) => {
      setMainAppPage((_) => page);
      window.ipcApi.registerMainAppPage((e, page) => {
        setMainAppPage((_) => page);
      });
      window.ipcApi.registerIsStartedOverlayListener((e, liveLaunchProperties) => {
        setLiveLaunchProperties((_) => liveLaunchProperties);
      });
    });
  }, []);

  return mainAppPage ? (
    liveLaunchProperties ? (
      <LiveControlPanelInStandBy liveLaunchProperties={liveLaunchProperties} />
    ) : mainAppPage.type === "liveSelection" ? (
      <MainChannelTopLoader mainChannelId={mainAppPage.mainChannelId} />
    ) : (
      <ChannelRegistrationLoader />
    )
  ) : (
    <div>Now Loading...</div>
  );
}
