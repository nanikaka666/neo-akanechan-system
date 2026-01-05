import { useEffect, useState } from "react";
import { ChannelRegistrationLoader } from "./channelRegistration/ChannelRegistrationLoader";
import { MainAppPage } from "../../../ipcEvent";
import { LiveControlPanelInStandBy } from "./liveControl/LiveControlPanelInStandBy";
import { LiveControlPanel } from "./liveControl/LiveControlPanel";
import { AuthFlow } from "./auth/AuthFlow";
import { MainChannelTop } from "./top/MainChannelTop";

export function MainApp() {
  const [mainAppPage, setMainAppPage] = useState<MainAppPage>();

  useEffect(() => {
    window.ipcApi.requestInitialMainAppPage().then((page) => {
      setMainAppPage((_) => page);
    });
    const remover = window.ipcApi.registerMainAppPage((e, page) => {
      setMainAppPage((_) => page);
    });
    return () => remover();
  }, []);

  return mainAppPage ? (
    mainAppPage.type === "inLive" ? (
      <LiveControlPanel liveLaunchProperties={mainAppPage.liveLaunchProperties} />
    ) : mainAppPage.type === "liveStandBy" ? (
      <LiveControlPanelInStandBy liveLaunchProperties={mainAppPage.liveLaunchProperties} />
    ) : mainAppPage.type === "liveSelection" ? (
      <MainChannelTop channel={mainAppPage.channel} liveBroadcasts={mainAppPage.liveBroadcasts} />
    ) : mainAppPage.type === "auth" ? (
      <AuthFlow />
    ) : (
      <ChannelRegistrationLoader />
    )
  ) : (
    <div>Now Loading...</div>
  );
}
