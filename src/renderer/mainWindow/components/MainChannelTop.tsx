import { useEffect, useState } from "react";
import { ChannelTop } from "../../../ipcEvent";
import { ChannelId } from "youtube-live-scraper";
import { MainChannelView } from "./MainChannelView";

export function MainChannelTop({ mainChannelId }: { mainChannelId: ChannelId }) {
  const [channelTop, setChannelTop] = useState<ChannelTop>();

  useEffect(() => {
    window.ipcApi.requestChannelTop(mainChannelId).then(setChannelTop).catch(console.log);
  }, []);

  return channelTop ? <MainChannelView channelTop={channelTop} /> : <div>Now Loading...</div>;
}
