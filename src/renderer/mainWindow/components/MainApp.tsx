import { useEffect, useState } from "react";
import { ChannelRegistrationLoader } from "./channelRegistration/ChannelRegistrationLoader";
import { ChannelId } from "youtube-live-scraper";
import { MainChannelTopLoader } from "./top/MainChannelTopLoader";
import { ChannelHavingClosestLive } from "../../../ipcEvent";
import { LiveControlPanel } from "./liveControl/LiveControlPanel";

export function MainApp() {
  const [mainChannelId, setMainChannelId] = useState<ChannelId>();
  const [channel, setChannel] = useState<ChannelHavingClosestLive>();

  useEffect(() => {
    window.ipcApi.requestMainChannelId().then((ch) => {
      setMainChannelId((_) => ch);
      window.ipcApi.registerNewMainChannelListener((e, channelId) => {
        setMainChannelId((_) => channelId);
      });
      window.ipcApi.registerIsStartedOverlayListener((e, channelHavingClosestLive) => {
        setChannel((_) => channelHavingClosestLive);
      });
    });
  }, []);

  return mainChannelId ? (
    channel ? (
      <LiveControlPanel channelHavingClosestLive={channel} />
    ) : (
      <MainChannelTopLoader mainChannelId={mainChannelId} />
    )
  ) : (
    <ChannelRegistrationLoader />
  );
}
