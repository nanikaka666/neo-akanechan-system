import { useEffect, useState } from "react";
import { ChannelRegistration } from "./ChannelRegistration";
import { ChannelId } from "youtube-live-scraper";
import { MainChannelTopLoader } from "./MainChannelTopLoader";

export function MainApp() {
  const [mainChannelId, setMainChannelId] = useState<ChannelId>();

  useEffect(() => {
    window.ipcApi.requestMainChannelId().then((ch) => {
      setMainChannelId((_) => ch);
      window.ipcApi.registerNewMainChannelListener((e, channelId) => {
        setMainChannelId((_) => channelId);
      });
    });
  }, []);

  return mainChannelId ? (
    <MainChannelTopLoader mainChannelId={mainChannelId} />
  ) : (
    <ChannelRegistration />
  );
}
