import { useState, MouseEvent } from "react";
import { Channel, LiveBroadcastYoutubeApiResponse } from "../../../../main/youtubeApi/model";
import { ChannelSummaryView } from "./ChannelSummaryView";
import ReactModal from "react-modal";
import { useModal } from "../hooks/useModal";
import { UserSettingsFormLoader } from "../userSettings/UserSettingsFormLoader";

export function MainChannelTop({
  channel,
  liveBroadcasts,
}: {
  channel: Channel;
  liveBroadcasts: LiveBroadcastYoutubeApiResponse[];
}) {
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
      <ChannelSummaryView channelSummary={channel} />
      <button onClick={turnOn}>ライブの設定</button>
      <ReactModal isOpen={showModal} onRequestClose={turnOff}>
        <UserSettingsFormLoader turnOff={turnOff} />
      </ReactModal>
      {liveBroadcasts.map((live) => {
        return (
          <div key={live.videoId.id}>
            <img
              src={live.snippet.thumbnails.default.url}
              alt="next live thumbnail"
              style={{ width: "360px" }}
            />
            <p>{live.snippet.title}</p>
            <p>{live.snippet.scheduledStartTime.toLocaleString()}</p>
            <p>{live.status.lifeCycleStatus}</p>
            <p>{live.status.privacyStatus}</p>
            {live.status.lifeCycleStatus !== "complete" && (
              <p>
                <button onClick={onClick} disabled={isConfirming}>
                  Live Start
                </button>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
