import { CarouselManager } from "./CarouselManager";
import { Clock } from "./Clock";
import { PoppingManager } from "./PoppingManager";
import { LikeCountIndicator } from "./LikeCountIndicator";
import { ViewerCountIndicator } from "./ViewerCountIndicator";
import { SubscriberCountIndicator } from "./SubscriberCountIndicator";
import { useEffect, useState } from "react";
import { LiveSettings } from "../../../types/liveSettings";

export function OverlayApp() {
  const [liveSettings, setLiveSettings] = useState<LiveSettings>();
  useEffect(() => {
    const remover = window.ipcApi.registerLiveSettingsListener((e, liveSettings) => {
      setLiveSettings((_) => liveSettings);
    });
    window.ipcApi.requestSyncLiveSettings();
    return () => remover();
  }, []);

  return (
    <div>
      <PoppingManager />
      {liveSettings && (
        <CarouselManager
          items={[
            <LikeCountIndicator key={1} gaugeLevel={1} />,
            <ViewerCountIndicator key={2} gaugeLevel={3} />,
            <SubscriberCountIndicator key={3} gaugeLevel={5} />,
            <Clock key={4} />,
          ]}
        />
      )}
    </div>
  );
}
