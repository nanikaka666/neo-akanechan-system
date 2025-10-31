import { ChannelHasNoClosestLive } from "../../../../ipcEvent";
import { ChannelSummaryView } from "./ChannelSummaryView";
import { UserSettingsFormLoader } from "../userSettings/UserSettingsFormLoader";
import { useModal } from "../hooks/useModal";
import ReactModal from "react-modal";

export function ChannelHasNoClosestLiveView({
  channelHasNoClosestLive,
}: {
  channelHasNoClosestLive: ChannelHasNoClosestLive;
}) {
  const [showModal, turnOn, turnOff] = useModal();
  return (
    <div style={{ position: "absolute", left: "100px" }}>
      <ChannelSummaryView channelSummary={channelHasNoClosestLive.channel} />
      <div>予定されているライブはありません</div>
      <button onClick={turnOn}>ライブの設定</button>
      <ReactModal isOpen={showModal} onRequestClose={turnOff}>
        <UserSettingsFormLoader channelSummary={channelHasNoClosestLive.channel} />
      </ReactModal>
    </div>
  );
}
