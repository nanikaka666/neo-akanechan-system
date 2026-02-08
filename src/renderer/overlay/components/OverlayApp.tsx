import { CarouselManager } from "./CarouselManager";
import { Clock } from "./Clock";
import { PoppingManager } from "./PoppingManager";
import { LikeCountIndicator } from "./LikeCountIndicator";
import { ViewerCountIndicator } from "./ViewerCountIndicator";
import { SubscriberCountIndicator } from "./SubscriberCountIndicator";

export function OverlayApp() {
  return (
    <div>
      <PoppingManager />
      <CarouselManager
        items={[
          <LikeCountIndicator key={1} gaugeLevel={1} />,
          <ViewerCountIndicator key={2} gaugeLevel={3} />,
          <SubscriberCountIndicator key={3} gaugeLevel={5} />,
          <Clock key={4} />,
        ]}
      />
    </div>
  );
}
