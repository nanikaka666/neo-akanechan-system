import { useEffect, useState } from "react";
import { ChannelRegistrationLoader } from "./channelRegistration/ChannelRegistrationLoader";
import { ChannelId } from "youtube-live-scraper";
import { MainChannelTopLoader } from "./top/MainChannelTopLoader";
import { LiveLaunchProperties } from "../../../ipcEvent";
import { LiveControlPanelInStandBy } from "./liveControl/LiveControlPanelInStandBy";

export function MainApp() {
  const [mainChannelId, setMainChannelId] = useState<ChannelId>();
  const [liveLaunchProperties, setLiveLaunchProperties] = useState<LiveLaunchProperties>();

  useEffect(() => {
    window.ipcApi.requestMainChannelId().then((ch) => {
      setMainChannelId((_) => ch);
      window.ipcApi.registerNewMainChannelListener((e, channelId) => {
        setMainChannelId((_) => channelId);
      });
      window.ipcApi.registerIsStartedOverlayListener((e, liveLaunchProperties) => {
        setLiveLaunchProperties((_) => liveLaunchProperties);
      });
    });
  }, []);

  return mainChannelId ? (
    liveLaunchProperties ? (
      <LiveControlPanelInStandBy liveLaunchProperties={liveLaunchProperties} />
    ) : (
      <MainChannelTopLoader mainChannelId={mainChannelId} />
    )
  ) : (
    <ChannelRegistrationLoader />
  );
}
