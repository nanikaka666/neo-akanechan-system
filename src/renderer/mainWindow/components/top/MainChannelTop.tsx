import { useState, MouseEvent } from "react";
import { ChannelSummaryView } from "./ChannelSummaryView";
import ReactModal from "react-modal";
import { useModal } from "../hooks/useModal";
import { UserSettingsFormLoader } from "../userSettings/UserSettingsFormLoader";
import { Channel, YoutubeLive } from "../../../../ipcEvent";

export function MainChannelTop({ channel, live }: { channel: Channel; live: YoutubeLive[] }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [showModal, turnOn, turnOff] = useModal();

  async function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsConfirming((_) => true);

    // todo: call this function
    // await window.ipcApi.requestOpenOverlay(channelHavingClosestLive);
    setIsConfirming((_) => false);
  }
  return (
    <div>
      <ChannelSummaryView channel={channel} />
      <button onClick={turnOn}>ライブの設定</button>
      <ReactModal isOpen={showModal} onRequestClose={turnOff}>
        <UserSettingsFormLoader turnOff={turnOff} />
      </ReactModal>
      {live.map((live) => {
        return (
          <div key={live.videoId.id}>
            <img src={live.thumbnailUrl} alt="next live thumbnail" style={{ width: "360px" }} />
            <p>{live.title}</p>
            <p>{live.scheduledStartTime.toLocaleString()}</p>
            <p>{live.isPublic ? "public" : "private"}</p>
            <p>
              <button onClick={onClick} disabled={isConfirming}>
                Live Start
              </button>
            </p>
          </div>
        );
      })}
    </div>
  );
}
