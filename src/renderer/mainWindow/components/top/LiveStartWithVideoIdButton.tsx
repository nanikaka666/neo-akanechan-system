import { useState } from "react";
import ReactModal from "react-modal";
import { useModal } from "../hooks/useModal";

export function LiveStartWithVideoIdButton() {
  const [showModal, turnOn, turnOff] = useModal();
  const [inputVideoId, setInputVideoId] = useState("");
  const [disabled, setDisabled] = useState(false);

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
                setDisabled((_) => true);
                await window.ipcApi.requestOpenOverlayWithVideoId(inputVideoId);
                setDisabled((_) => false);
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
