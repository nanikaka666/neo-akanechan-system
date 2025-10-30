import { useEffect, useState } from "react";
import { ChannelSummary } from "../../../ipcEvent";
import { UserSettings } from "../../../main/userSettings";
import { UserSettingsForm } from "./UserSettingsForm";

export function UserSettingsFormLoader({ channelSummary }: { channelSummary: ChannelSummary }) {
  const [userSettings, setUserSettings] = useState<UserSettings>();

  useEffect(() => {
    window.ipcApi.requestUserSettings(channelSummary.channelId).then((res) => {
      setUserSettings((_) => res);
      window.ipcApi.registerUpdatedUserSettingsListener((e, channelId, settings) => {
        if (channelId.id === channelSummary.channelId.id) {
          setUserSettings((_) => settings);
        }
      });
    });
  }, []);

  return userSettings ? (
    <UserSettingsForm channelSummary={channelSummary} userSettings={userSettings} />
  ) : (
    <div>Now Loading...</div>
  );
}
