import { useEffect, useState } from "react";
import { ChannelRegistration } from "./ChannelRegistration";
import { ChannelId } from "youtube-live-scraper";
import { MainChannelTop } from "./MainChannelTop";

export function App() {
  const [mainChannelId, setMainChannelId] = useState<ChannelId>();

  useEffect(() => {
    window.ipcApi.requestMainChannelId().then((ch) => {
      setMainChannelId((_) => ch);
      window.ipcApi.registerNewMainChannelListener((e, channelId) => {
        setMainChannelId((_) => channelId);
      });
    });
  }, []);

  return mainChannelId ? <MainChannelTop mainChannelId={mainChannelId} /> : <ChannelRegistration />;
}
