import { useState } from "react";
import ReactModal from "react-modal";
import { useModal } from "../../hooks/useModal";
import { useButton } from "../../hooks/useButton";

export function LiveStartWithVideoIdButton() {
  const [showModal, turnOn, turnOff] = useModal();
  const [inputVideoId, setInputVideoId] = useState("");
  const [disabled, disable, enable] = useButton();

  return (
    <>
      <button className="live-start-with-video-id" onClick={turnOn}>
        VideoIdを直接指定する
      </button>
      <ReactModal isOpen={showModal} onRequestClose={turnOff} className="video-id-input-modal">
        <div>
          <label>
            <span>Video Id</span>
            <input
              type="text"
              onChange={(e) => {
                setInputVideoId((_) => e.target.value);
              }}
              value={inputVideoId}
            />
          </label>
          <button
            onClick={async (e) => {
              e.preventDefault();
              disable();
              await window.ipcApi.mainWindow.mainAppPage.requestTransitToLiveStandByByVideoId(
                inputVideoId,
              );
              enable();
            }}
            disabled={disabled || inputVideoId.length === 0}
          >
            OK
          </button>
        </div>
      </ReactModal>
    </>
  );
}
