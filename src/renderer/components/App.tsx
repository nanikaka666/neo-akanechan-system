import { useEffect, useState } from "react";
import { MainWindow } from "./MainWindow";
import { ChannelId } from "youtube-live-scraper";

export function App() {
  const [mainChannelId, setMainChannelId] = useState<ChannelId>();

  useEffect(() => {
    window.ipcApi.requestMainChannelId().then((ch) => {
      setMainChannelId((_) => ch);
    });
  }, []);

  return mainChannelId ? <div>{mainChannelId.id}</div> : <MainWindow></MainWindow>;
}
