import { useEffect, useState } from "react";
import { ChannelRegistrationForm } from "./ChannelRegistrationForm";
import { ChannelId } from "youtube-live-scraper";

export function App() {
  const [mainChannelId, setMainChannelId] = useState<ChannelId>();

  useEffect(() => {
    window.ipcApi.requestMainChannelId().then((ch) => {
      setMainChannelId((_) => ch);
    });
  }, []);

  return mainChannelId ? (
    <>
      <div>メインチャンネル: {mainChannelId.id}</div>
    </>
  ) : (
    <ChannelRegistrationForm></ChannelRegistrationForm>
  );
}
