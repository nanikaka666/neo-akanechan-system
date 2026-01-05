import { useEffect, useState } from "react";
import { UserSettings } from "../../../../main/userSettings";
import { UserSettingsForm } from "./UserSettingsForm";
import { Channel } from "../../../../main/youtubeApi/model";

export function UserSettingsFormLoader({ channelSummary }: { channelSummary: Channel }) {
  const [userSettings, setUserSettings] = useState<UserSettings>();

  useEffect(() => {
    window.ipcApi.requestUserSettings().then((res) => {
      setUserSettings((_) => res);
    });
    const remover = window.ipcApi.registerUpdatedUserSettingsListener((e, settings) => {
      setUserSettings((_) => settings);
    });
    return () => remover();
  }, []);

  return userSettings ? (
    <UserSettingsForm channelSummary={channelSummary} userSettings={userSettings} />
  ) : (
    <div>Now Loading...</div>
  );
}
