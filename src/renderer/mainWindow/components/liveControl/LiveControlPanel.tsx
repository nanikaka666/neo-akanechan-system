import { useState } from "react";
import { ChannelHavingClosestLive } from "../../../../ipcEvent";
import { UserSettings } from "../../../../main/userSettings";
import { SideBar } from "./SideBar";

export type Mode = "commentViewer" | "chanceTime" | "rankings" | "neighborhoods";

export function LiveControlPanel({
  channelHavingClosestLive,
  userSettings,
}: {
  channelHavingClosestLive: ChannelHavingClosestLive;
  userSettings: UserSettings;
}) {
  const [mode, setMode] = useState<Mode>("commentViewer");

  return (
    <>
      <SideBar
        channelHavingClosestLive={channelHavingClosestLive}
        userSettings={userSettings}
        mode={mode}
        setMode={setMode}
      />
      <div>hoge</div>
    </>
  );
}
