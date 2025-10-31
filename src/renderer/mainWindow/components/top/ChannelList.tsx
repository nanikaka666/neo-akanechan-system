import { CSSProperties, useEffect, useState } from "react";
import { ChannelSummary } from "../../../../ipcEvent";
import { ChannelId } from "youtube-live-scraper";
import ReactModal from "react-modal";
import { ChannelRegistrationLoader } from "../channelRegistration/ChannelRegistrationLoader";

export function ChannelList({ currentMainChannelId }: { currentMainChannelId: ChannelId }) {
  const [channels, setChannels] = useState<ChannelSummary[]>();
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    window.ipcApi.requestRegisteredChannels().then(setChannels);

    // close modal when re-render this component.
    setShowRegistrationModal((_) => false);
  }, [currentMainChannelId]);

  return channels ? (
    <div style={{ width: "100px", height: "100%", position: "absolute", top: 0, left: 0 }}>
      ChannelList
      {channels.map((channel) => {
        const styles: CSSProperties | undefined =
          channel.channelId.id === currentMainChannelId.id
            ? {
                backgroundColor: "orange",
              }
            : undefined;
        return (
          <div
            key={channel.channelId.id}
            style={styles}
            onClick={() => {
              if (currentMainChannelId.id !== channel.channelId.id) {
                window.ipcApi.requestSwitchMainChannel(channel.channelId);
              }
            }}
          >
            <img src={channel.ownerIcon} style={{ width: "32px", height: "32px" }} />
            {channel.channelTitle.title}
          </div>
        );
      })}
      <div onClick={() => setShowRegistrationModal((_) => true)}>Add Channel</div>
      <ReactModal
        style={{ content: { inset: "20px" } }}
        isOpen={showRegistrationModal}
        onRequestClose={() => setShowRegistrationModal((_) => false)}
      >
        <ChannelRegistrationLoader />
      </ReactModal>
    </div>
  ) : (
    <div style={{ width: "100px", height: "100%", position: "absolute", top: 0, left: 0 }}>
      Now Loading...
    </div>
  );
}
