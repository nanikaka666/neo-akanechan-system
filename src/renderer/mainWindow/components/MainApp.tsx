import { useEffect, useState } from "react";
import { ChannelRegistrationLoader } from "./channelRegistration/ChannelRegistrationLoader";
import { ChannelId } from "youtube-live-scraper";
import { MainChannelTopLoader } from "./top/MainChannelTopLoader";
import { LiveLaunchProperties, MainAppPage } from "../../../ipcEvent";
import { LiveControlPanelInStandBy } from "./liveControl/LiveControlPanelInStandBy";

export function MainApp() {
  const [mainChannelId, setMainChannelId] = useState<ChannelId>();
  const [liveLaunchProperties, setLiveLaunchProperties] = useState<LiveLaunchProperties>();
  const [mainAppPage, setMainAppPage] = useState<MainAppPage>();

  useEffect(() => {
    window.ipcApi.requestInitialMainAppPage().then((page) => {
      // setMainChannelId((_) => ch);
      setMainAppPage((_) => page);
      window.ipcApi.registerNewMainChannelListener((e, channelId) => {
        setMainChannelId((_) => channelId);
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
