import { useButton } from "../../../hooks/useButton";

export function ManuallyEntryCloseButton() {
  const [disabled, disable, enable] = useButton();
  return (
    <button
      className="action-button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        disable();
        window.ipcApi.mainWindow.competition.requestManuallyEntryClose().then(() => {
          enable();
        });
      }}
    >
      今すぐ回答を締め切る
    </button>
  );
}
