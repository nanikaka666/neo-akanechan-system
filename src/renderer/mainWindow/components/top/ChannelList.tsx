import { CSSProperties, useEffect, useState, MouseEvent } from "react";
import { ChannelSummary } from "../../../../ipcEvent";
import ReactModal from "react-modal";
import { ChannelRegistrationLoader } from "../channelRegistration/ChannelRegistrationLoader";
import { useModal } from "../hooks/useModal";
import { ChannelId } from "../../../../main/youtubeApi/model";

export function ChannelList({ currentMainChannelId }: { currentMainChannelId: ChannelId }) {
  const [channels, setChannels] = useState<ChannelSummary[]>();
  const [showModal, turnOn, turnOff] = useModal();

  function deleteChannel(e: MouseEvent, channel: ChannelSummary) {
    e.stopPropagation();
    window.ipcApi.requestDeletingChannel(channel);
  }

  useEffect(() => {
    window.ipcApi.requestRegisteredChannels().then((lists) => {
      setChannels((_) => lists);
    });
    const remover = window.ipcApi.registerUpdatedChannelListListener((e, lists) => {
      setChannels((_) => lists);
    });

    // close modal when re-render this component.
    turnOff();
    return () => remover();
  }, []);

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
            <button onClick={(e) => deleteChannel(e, channel)}>削除</button>
          </div>
        );
      })}
      <div onClick={turnOn}>Add Channel</div>
      <ReactModal
        style={{ content: { inset: "20px" } }}
        isOpen={showModal}
        onRequestClose={turnOff}
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
