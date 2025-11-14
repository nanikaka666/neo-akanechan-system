import { useEffect, useState } from "react";
import { ChannelRegistrationLoader } from "./channelRegistration/ChannelRegistrationLoader";
import { ChannelId } from "youtube-live-scraper";
import { MainChannelTopLoader } from "./top/MainChannelTopLoader";
import { ChannelHavingClosestLive } from "../../../ipcEvent";
import { LiveControlPanelInStandBy } from "./liveControl/LiveControlPanelInStandBy";
import { UserSettings } from "../../../main/userSettings";

interface ChannelAndSettings {
  channel: ChannelHavingClosestLive;
  settings: UserSettings;
}

export function MainApp() {
  const [mainChannelId, setMainChannelId] = useState<ChannelId>();
  const [channelAndSettings, setChannelAndSettings] = useState<ChannelAndSettings>();

  useEffect(() => {
    window.ipcApi.requestMainChannelId().then((ch) => {
      setMainChannelId((_) => ch);
      window.ipcApi.registerNewMainChannelListener((e, channelId) => {
        setMainChannelId((_) => channelId);
      });
      window.ipcApi.registerIsStartedOverlayListener(
        (e, channelHavingClosestLive, userSettings) => {
          setChannelAndSettings((_) => {
            return {
              channel: channelHavingClosestLive,
              settings: userSettings,
            } satisfies ChannelAndSettings;
          });
        },
      );
    });
  }, []);

  return mainChannelId ? (
    channelAndSettings ? (
      <LiveControlPanelInStandBy
        channelHavingClosestLive={channelAndSettings.channel}
        userSettings={channelAndSettings.settings}
      />
    ) : (
      <MainChannelTopLoader mainChannelId={mainChannelId} />
    )
  ) : (
    <ChannelRegistrationLoader />
  );
}
