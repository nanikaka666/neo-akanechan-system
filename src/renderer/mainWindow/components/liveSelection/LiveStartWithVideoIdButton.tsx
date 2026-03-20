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
      <button onClick={turnOn}>VideoIdを指定してアプリを起動</button>
      <ReactModal isOpen={showModal} onRequestClose={turnOff}>
        <div>
          <label>
            Video Idを入力
            <input
              type="text"
              onChange={(e) => {
                setInputVideoId((_) => e.target.value);
              }}
              value={inputVideoId}
            />
            <button
              onClick={async (e) => {
                e.preventDefault();
                disable();
                await window.ipcApi.mainWindow.mainAppPage.requestOpenOverlayWithVideoId(
                  inputVideoId,
                );
                enable();
              }}
              disabled={disabled}
            >
              Start Live
            </button>
          </label>
        </div>
      </ReactModal>
    </>
  );
}
