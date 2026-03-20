import { useButton } from "../hooks/useButton";

export function StartLiveButton() {
  const [disabled, disable, enable] = useButton();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        disable();
        window.ipcApi.mainWindow.requestStartLive().then(() => enable());
      }}
      disabled={disabled}
    >
      ライブを開始する
    </button>
  );
}
