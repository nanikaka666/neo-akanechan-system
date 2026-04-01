import { useButton } from "../../hooks/useButton";

export function StartLiveButton() {
  const [disabled, disable, enable] = useButton();

  return (
    <button
      className="action-button"
      onClick={(e) => {
        e.preventDefault();
        disable();
        window.ipcApi.mainWindow.mainAppPage.requestStartLive().then(() => enable());
      }}
      disabled={disabled}
    >
      ライブを開始する
    </button>
  );
}
