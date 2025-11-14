import { useState, MouseEvent } from "react";
import { ChannelHavingClosestLive } from "../../../../ipcEvent";
import { ChannelSummaryView } from "./ChannelSummaryView";
import { UserSettingsFormLoader } from "../userSettings/UserSettingsFormLoader";
import ReactModal from "react-modal";
import { useModal } from "../hooks/useModal";

export function ChannelHavingClosestLiveView({
  channelHavingClosestLive,
}: {
  channelHavingClosestLive: ChannelHavingClosestLive;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [showModal, turnOn, turnOff] = useModal();

  async function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsConfirming((_) => true);

    await window.ipcApi.requestOpenOverlay(channelHavingClosestLive);
    setIsConfirming((_) => false);
  }

  return (
    <div style={{ position: "absolute", left: "100px" }}>
      <ChannelSummaryView channelSummary={channelHavingClosestLive.channel} />
      <div>
        <p>Next Live</p>
        <img
          src={channelHavingClosestLive.closestLive.thumbnail}
          alt="next live thumbnail"
          style={{ width: "360px" }}
        />
        <div>{channelHavingClosestLive.closestLive.title.title}</div>
        <div>{channelHavingClosestLive.closestLive.isOnAir ? "On Air" : "Prepareing"}</div>
        <button onClick={onClick} disabled={isConfirming}>
          Live Start
        </button>
      </div>
      <button onClick={turnOn}>ライブの設定</button>
      <ReactModal isOpen={showModal} onRequestClose={turnOff}>
        <UserSettingsFormLoader channelSummary={channelHavingClosestLive.channel} />
      </ReactModal>
    </div>
  );
}
