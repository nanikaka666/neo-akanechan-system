import { useState, MouseEvent } from "react";
import { LiveSummary } from "../../../ipcEvent";

export function ClosestLiveView({ closestLive }: { closestLive: LiveSummary }) {
  const [isConfirming, setIsConfirming] = useState(false);

  async function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsConfirming((_) => true);

    const res = await window.ipcApi.requestOpenOverlay(closestLive);
    console.log(res);
    setIsConfirming((_) => false);
  }
  return (
    <div>
      <p>Next Live</p>
      <img src={closestLive.thumbnail} alt="next live thumbnail" style={{ width: "360px" }} />
      <div>{closestLive.title.title}</div>
      <div>{closestLive.isOnAir ? "On Air" : "Prepareing"}</div>
      <button onClick={onClick} disabled={isConfirming}>
        Live Start
      </button>
    </div>
  );
}
