import { useEffect, useState } from "react";
import { MainWindow } from "./MainWindow";
import { ChannelSummary } from "../../ipcEvent";

export function App() {
  const [mainChannel, setMainChannel] = useState<ChannelSummary>();

  useEffect(() => {
    window.ipcApi.requestMainChannel().then((ch) => {
      setMainChannel((_) => ch);
    });
  }, []);

  return mainChannel ? <div>{mainChannel.channelTitle.title}</div> : <MainWindow></MainWindow>;
}
