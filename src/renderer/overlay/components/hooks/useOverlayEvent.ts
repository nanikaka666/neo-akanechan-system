import { useEffect, useState } from "react";
import { NoEvent, OverlayEvent } from "../../../../types/overlay";

const noEvent: OverlayEvent = { type: "noEvent" };

export function useOverlayEvent() {
  const [overlayEvent, setOverlayEvent] = useState<OverlayEvent>(noEvent);
  const [eventQueue, setEventQueue] = useState<Exclude<OverlayEvent, NoEvent>[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (overlayEvent.type !== "noEvent") {
        return;
      }
      if (eventQueue.length === 0) {
        return;
      }
      const [head, ...rest] = eventQueue;
      setOverlayEvent((_) => head);
      setEventQueue((_) => rest);
    }, 10 * 1000);
    return () => clearInterval(intervalId);
  }, [overlayEvent, eventQueue]);

  useEffect(() => {
    const remover = window.ipcApi.registerOverlayEvent((e, overlayEvent) => {
      setEventQueue((prev) => [...prev, overlayEvent]);
    });
    return () => remover();
  }, []);

  return [overlayEvent, () => setOverlayEvent((_) => noEvent)] as const;
}
