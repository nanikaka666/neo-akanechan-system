import { useEffect, useState } from "react";
import { ChannelSummary } from "../../../../ipcEvent";
import { UserSettings } from "../../../../main/userSettings";
import { UserSettingsForm } from "./UserSettingsForm";

export function UserSettingsFormLoader({ channelSummary }: { channelSummary: ChannelSummary }) {
  const [userSettings, setUserSettings] = useState<UserSettings>();

  useEffect(() => {
    window.ipcApi.requestUserSettings(channelSummary.channelId).then((res) => {
      setUserSettings((_) => res);
    });
    const remover = window.ipcApi.registerUpdatedUserSettingsListener((e, channelId, settings) => {
      if (channelSummary.channelId.id === channelId.id) {
        setUserSettings((_) => settings);
      }
    });
    return () => remover();
  }, []);

  return userSettings ? (
    <UserSettingsForm channelSummary={channelSummary} userSettings={userSettings} />
  ) : (
    <div>Now Loading...</div>
  );
}
