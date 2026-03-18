import { useButton } from "../hooks/useButton";

export function AccountDisconnectButton() {
  const [disabled, disable, enable] = useButton();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        disable();
        window.ipcApi.requestAccountDisconnect().then(() => enable());
      }}
      disabled={disabled}
    >
      Youtubeアカウントの連携を解除
    </button>
  );
}
