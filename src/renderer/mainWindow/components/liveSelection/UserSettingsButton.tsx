import ReactModal from "react-modal";
import { UserSettingsFormLoader } from "../userSettings/UserSettingsFormLoader";
import { useModal } from "../hooks/useModal";

export function UserSettingsButton() {
  const [showModal, turnOn, turnOff] = useModal();

  return (
    <div>
      <button onClick={turnOn}>ライブの設定</button>
      <ReactModal isOpen={showModal} onRequestClose={turnOff}>
        <UserSettingsFormLoader turnOff={turnOff} />
      </ReactModal>
    </div>
  );
}
